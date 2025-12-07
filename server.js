const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ffmpeg = require('fluent-ffmpeg');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(mp4|mov|avi|webm)$/i;
    const extname = allowedExtensions.test(file.originalname);
    
    // Allowed MIME types for video files
    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime', // .MOV files
      'video/x-msvideo', // .AVI files
      'video/webm',
      'video/mpeg'
    ];
    
    const mimetype = allowedMimeTypes.includes(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      const error = new Error(`File type not allowed. Extension: ${path.extname(file.originalname)}, MIME type: ${file.mimetype}`);
      cb(error);
    }
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDZWUEqfCe8ZA2jVulhioiNtgz1-yIGCL4');

// Helper function to list available models (for debugging)
async function listAvailableModels() {
  try {
    // Note: The SDK doesn't have a direct listModels method, but we can try different model names
    console.log('[Gemini] Available model names to try: gemini-1.5-flash, gemini-1.5-pro, gemini-pro, models/gemini-1.5-flash, models/gemini-pro');
  } catch (error) {
    console.error('[Gemini] Could not list models:', error);
  }
}

// Store video metadata and scenes
const videoData = new Map();

// Helper function to get video duration and fps using ffprobe
function getVideoMetadata(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('[FFmpeg] Error getting video metadata:', err);
        reject(err);
      } else {
        const duration = metadata.format.duration || 30;
        const fps = metadata.streams[0]?.r_frame_rate 
          ? eval(metadata.streams[0].r_frame_rate) 
          : 30;
        const frameCount = Math.floor(duration * fps);
        resolve({ duration, fps, frameCount });
      }
    });
  });
}

// Helper function to detect motion changes and extract key frames using ffmpeg
async function detectMotionChanges(videoPath, fps) {
  return new Promise((resolve) => {
    // First get video duration using ffprobe
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('[FFmpeg] Error getting video metadata:', err);
        resolve(createUniformKeyFrames(fps, 30, 8));
        return;
      }
      
      const duration = metadata.format.duration || 30;
      const numKeyFrames = 8;
      
      // Extract frames at strategic points representing action phases
      // We'll sample at intervals that likely capture motion changes
      const keyFrameInterval = Math.floor((duration * fps) / numKeyFrames);
      const frames = [];
      
      // Create key frames with slight offset to avoid always being at exact intervals
      for (let i = 0; i < numKeyFrames; i++) {
        const baseFrame = i * keyFrameInterval;
        // Add small random offset (±10% of interval) to capture varied action phases
        const offset = Math.floor(keyFrameInterval * (0.3 + i * 0.1));
        const frameNum = Math.min(baseFrame + offset, Math.floor(duration * fps) - 1);
        
        if (frameNum >= 0) {
          frames.push({
            frameNumber: frameNum,
            timestamp: frameNum / fps
          });
        }
      }
      
      console.log(`[FFmpeg] Generated ${frames.length} key frames for motion analysis`);
      resolve({ keyFrames: frames });
    });
  });
}

// Helper to create uniform key frames as fallback
function createUniformKeyFrames(fps, duration, numFrames) {
  const keyFrameInterval = Math.floor((duration * fps) / numFrames);
  const frames = [];
  
  for (let i = 0; i < numFrames; i++) {
    const frameNum = i * keyFrameInterval;
    frames.push({
      frameNumber: frameNum,
      timestamp: frameNum / fps
    });
  }
  
  return { keyFrames: frames };
}

// Improved function to segment video based on motion analysis
async function segmentVideoWithMotion(videoPath, duration, fps) {
  try {
    console.log('[Segment] Detecting motion changes...');
    const motionData = await detectMotionChanges(videoPath, fps);
    const keyFrames = motionData.keyFrames || [];
    
    console.log(`[Segment] Found ${keyFrames.length} key frames`);
    
    if (keyFrames.length === 0) {
      console.log('[Segment] No key frames detected, using uniform segmentation');
      return segmentVideoUniform(duration, fps);
    }
    
    // Group key frames into segments (target: 5 segments)
    const numSegments = 5;
    const segments = [];
    
    // Use key frames to define segment boundaries
    for (let i = 0; i < numSegments; i++) {
      const segmentRatio = i / numSegments;
      const nextSegmentRatio = (i + 1) / numSegments;
      
      // Find key frames in this segment range
      const segmentKeyFrames = keyFrames.filter(kf => {
        const ratio = kf.timestamp / duration;
        return ratio >= segmentRatio && ratio < nextSegmentRatio;
      });
      
      // Calculate segment boundaries
      const startFrame = i === 0 
        ? 0 
        : (segmentKeyFrames.length > 0 ? segmentKeyFrames[0].frameNumber : Math.floor(segmentRatio * duration * fps));
      
      const endFrame = i === numSegments - 1
        ? Math.floor(duration * fps)
        : (segmentKeyFrames.length > 0 
            ? segmentKeyFrames[segmentKeyFrames.length - 1].frameNumber 
            : Math.floor(nextSegmentRatio * duration * fps));
      
      // Use middle key frame or calculate freeze frame
      const freezeFrame = segmentKeyFrames.length > 0
        ? segmentKeyFrames[Math.floor(segmentKeyFrames.length / 2)].frameNumber
        : Math.floor((startFrame + endFrame) / 2);
      
      segments.push({
        id: i + 1,
        startFrame: startFrame,
        endFrame: endFrame,
        freezeFrame: freezeFrame,
        start: startFrame / fps,
        end: endFrame / fps,
        freeze_at: freezeFrame / fps
      });
    }
    
    console.log(`[Segment] Created ${segments.length} segments based on motion analysis`);
    return segments;
  } catch (error) {
    console.error('[Segment] Error in motion-based segmentation, falling back to uniform:', error);
    // Fallback to uniform segmentation
    return segmentVideoUniform(duration, fps);
  }
}

// Fallback uniform segmentation
function segmentVideoUniform(duration, fps) {
  const segments = [];
  const numSegments = 5;
  const segmentDuration = duration / numSegments;
  
  for (let i = 0; i < numSegments; i++) {
    const start = Math.round(i * segmentDuration * 10) / 10;
    const end = Math.round((i + 1) * segmentDuration * 10) / 10;
    const freeze_at = (start + end) / 2;
    
    segments.push({
      id: i + 1,
      startFrame: Math.floor(start * fps),
      endFrame: Math.floor(end * fps),
      freezeFrame: Math.floor(freeze_at * fps),
      start: start,
      end: end,
      freeze_at: freeze_at
    });
  }
  
  return segments;
}

// Legacy function - kept for compatibility (will be replaced)
function segmentVideo(duration, numSegments = 5) {
  return segmentVideoUniform(duration, 30); // Use 30 fps as default
}

// Generate coaching analysis using Gemini
async function generateCoachingAnalysis(scenes, sport, videoPath, fps = 30, terrain = 'blue') {
  console.log(`[Gemini] Starting analysis for ${sport}, terrain: ${terrain}, ${scenes.length} scenes, FPS: ${fps}`);
  
  // Use Gemini 2.5 Flash - confirmed available with this API key
  const modelName = 'models/gemini-2.5-flash';
  const textModel = genAI.getGenerativeModel({ model: modelName });
  console.log(`[Gemini] Using model: ${modelName}`);
  
  const framework = sport === 'ski' ? 'CSIA' : 'CASI';
  const frameworkConcepts = sport === 'ski' 
    ? 'CSIA teaching framework concepts such as: Stance & Balance, Turning shape & control, Use of the lower body for edging and steering, Separation between upper and lower body, Pressure control, Flow & rhythm'
    : 'CASI teaching framework concepts such as: Body alignment (nose-to-tail & toe-to-heel), Pivoting & edge release, Balance over the working edge, Upper/lower body coordination, Tilt, Twist, Pressure, and Pivot concepts';
  
  // Terrain information mapping
  const terrainInfo = {
    'flat': { name: '平地 / 绿道', level: '初级地形', description: '平缓的初级坡道，适合基础练习' },
    'blue': { name: '蓝道', level: '中级地形', description: '中等坡度的中级坡道，适合技能提升' },
    'black': { name: '黑道', level: '高级陡坡', description: '陡峭的高级坡道，需要高级技术' },
    'mogul': { name: '蘑菇道', level: '雪包地形', description: '有雪包和起伏的地形，需要节奏控制' },
    'freestyle': { name: '自由式', level: '公园、跳台、道具', description: '包含跳台、道具、障碍的自由式地形' }
  };
  
  const currentTerrain = terrainInfo[terrain] || terrainInfo['blue'];
  
  // Convert scenes to frame-based format for Gemini
  const scenesWithFrames = scenes.map(scene => ({
    id: scene.id,
    startFrame: scene.startFrame || Math.floor(scene.start * fps),
    endFrame: scene.endFrame || Math.floor(scene.end * fps),
    freezeFrame: scene.freezeFrame || Math.floor(scene.freeze_at * fps),
    start: scene.start,
    end: scene.end,
    freeze_at: scene.freeze_at
  }));
  
  const prompt = `你是一位经过${framework}框架认证的${sport === 'ski' ? '双板' : '单板'}教练。你的职责是提供建设性、鼓励性的反馈，帮助学生提高技术。

【重要】你必须使用简体中文回复。所有标题（title）和教练文本（coaching_text）必须使用简体中文。

请分析以下视频片段并提供教练反馈。视频时长为 ${scenes[scenes.length - 1].end} 秒。

需要分析的场景：
${JSON.stringify(scenesWithFrames, null, 2)}

请按照以下重要指导原则为每个场景提供教练分析：

1. 使用${frameworkConcepts}
2. 使用流畅、自然的句子，但要详细和准确。要像真正的教练对学生说话一样。
3. 要有建设性和鼓励性 - 专注于可以改进的地方，而不仅仅是错误。
4. 对于每个场景，提供：
   - 一个5-10字的标题，总结关键教练要点（例如："入弯阶段"、"压刃控制"等）
   - 教练文本（3-5句话），必须包含：
     * 详细描述滑手/滑雪者的具体动作和身体部位状态：
       - 上半身、肩膀、髋部的位置和动作
       - 膝盖弯曲、脚踝屈伸的协调情况
       - 板刃使用、重心位置、压刃角度
       - 雪花喷出情况（说明控制力度）
     * 指出具体的技术问题（例如："髋部略僵"、"重心偏后脚"、"肩膀带动较多"等）
     * 解释为什么这很重要 - 联系到控制、稳定性、速度管理、转弯形状等
     * 提供1-2个具体改进建议
   - freeze_at时间戳（秒），使用场景中的freezeFrame对应的精确时间

教练文本风格：
- 尽可能以积极的观察开始
- 使用"你"的语言直接对学生说话
- 解释每个技术背后的"为什么"
- 提供具体的、可操作的建议
- 以鼓励结束
- 避免技术生物力学术语 - 使用简单、直观的描述
- 永远不要严厉或批评 - 始终给予支持

返回仅包含JSON对象（无markdown，无代码块，纯JSON格式），格式如下：
{
  "scenes": [
    {
      "id": <数字>,
      "start": <秒数>,
      "end": <秒数>,
      "freeze_at": <秒数>,
      "title": "<5-10字中文标题，例如：入弯阶段、压刃控制等>",
      "coaching_text": "<详细的${framework}框架分析，3-5句话，包含具体身体部位分析，根据地形特点给出针对性建议，友好且鼓励性的建设性反馈，必须使用简体中文>"
    }
  ]
}

注意：title 和 coaching_text 字段中的所有内容必须使用简体中文。

重要：不要使用通用占位文本。根据典型的${sport === 'ski' ? '滑雪' : '单板滑雪'}动作分析每个场景，并提供具体、详细的反馈。每个场景应该有独特、个性化的教练建议，真正帮助学生提高。

良好教练文本示例（注意要根据地形给出针对性分析）：
"入弯阶段：上半身开始朝下坡方向旋转，引导板子进入转向。可见膝盖弯曲、脚踝屈伸协调。不过髋部略僵，肩膀带动较多。在${currentTerrain.name}上，建议在转弯起始时，先让髋部主动引导，肩膀跟随，这样可以建立更流畅的转向节奏，更好地控制${currentTerrain.level === '初级地形' ? '速度和稳定性' : currentTerrain.level === '高级陡坡' ? '陡坡上的压力和控制' : '转弯质量'}。"

不好的教练文本示例（不要这样做）：
"这是场景1，从0秒到6秒。专注于保持良好的站姿和平衡。"

记住：coaching_text应该听起来像一位支持性的教练在与学生对话，但要非常详细和准确。必须包含具体的身体部位分析，并且要根据地形特点给出针对性的建议。要有建设性、具体和鼓励性。

【再次强调】你必须使用简体中文回复所有内容。title 和 coaching_text 中的所有文字都必须是简体中文。
根据${currentTerrain.name}（${currentTerrain.level}）的特点，评估滑手水平并给出适合该地形和水平的建议。`;

  try {
    console.log('[Gemini] Sending request to Gemini 2.5 Flash...');
    console.log('[Gemini] Prompt length:', prompt.length, 'characters');
    console.log('[Gemini] Using API key: AIzaSyDZWUEqfCe8ZA2jVulhioiNtgz1-yIGCL4');
    
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('[Gemini] ✅ Received response from API (length:', text.length, 'chars)');
    console.log('[Gemini] Response preview (first 500 chars):');
    console.log(text.substring(0, 500));
    
    // Extract JSON from the response (it might have markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      console.log('[Gemini] Extracted JSON from markdown code block');
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
      console.log('[Gemini] Extracted JSON from code block');
    }
    
    // Try to find JSON object if it's embedded in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const coachingData = JSON.parse(jsonText);
    console.log('[Gemini] ✅ Successfully parsed JSON, returned', coachingData.scenes?.length || 0, 'scenes');
    
    // Validate the response structure
    if (!coachingData.scenes || !Array.isArray(coachingData.scenes)) {
      throw new Error('Invalid response structure from Gemini API - missing scenes array');
    }
    
    // Validate each scene has required fields
    coachingData.scenes.forEach((scene, idx) => {
      if (!scene.coaching_text || scene.coaching_text.length < 20) {
        console.warn(`[Gemini] Warning: Scene ${idx + 1} has very short coaching_text (${scene.coaching_text?.length || 0} chars)`);
      }
    });
    
    console.log('[Gemini] ✅ Validation complete, returning coaching data');
    return coachingData;
  } catch (error) {
    console.error('[Gemini] ❌ ERROR generating coaching analysis:');
    console.error('[Gemini] Error message:', error.message);
    console.error('[Gemini] Error name:', error.name);
    if (error.stack) {
      console.error('[Gemini] Error stack:', error.stack);
    }
    
    // Re-throw the error with helpful message
    throw new Error(`Gemini 2.5 Flash API错误: ${error.message}。请检查您的API密钥，确保它可以访问Gemini模型。`);
  }
}

// Generate practice recommendations based on coaching analysis
async function generatePracticeRecommendations(sport, coachingData) {
  const modelName = 'models/gemini-2.5-flash';
  const textModel = genAI.getGenerativeModel({ model: modelName });
  
  const framework = sport === 'ski' ? 'CSIA' : 'CASI';
  const sportName = sport === 'ski' ? '滑雪' : '单板滑雪';
  
  // Extract key issues from coaching data
  const coachingSummary = coachingData.scenes.map(scene => ({
    title: scene.title,
    coaching_text: scene.coaching_text
  }));
  
  const prompt = `你是一位${framework}框架认证的${sportName}教练。根据以下教练反馈，为学生推荐3-5个针对性的专项练习。

教练反馈摘要：
${JSON.stringify(coachingSummary, null, 2)}

请为每个练习提供：
1. 练习名称（英文名称 + 中文翻译）
2. 练习描述（2-3句话，说明如何做）
3. 练习重点（1-2个关键要点）

格式要求（使用简体中文）：
返回JSON格式：
{
  "recommendations": [
    {
      "name_en": "<英文练习名称>",
      "name_cn": "<中文练习名称>",
      "description": "<练习描述，2-3句话>",
      "keyPoints": ["关键要点1", "关键要点2"]
    }
  ]
}

示例格式（针对单板滑雪）：
{
  "recommendations": [
    {
      "name_en": "Nose Pressure Drill",
      "name_cn": "板头压力练习",
      "description": "直滑时轻压前脚，让板头保持引导感。熟练后应用于转弯入弯瞬间。",
      "keyPoints": ["保持前脚压力", "板头引导转向"]
    },
    {
      "name_en": "J-turn",
      "name_cn": "半弯练习",
      "description": "练单边弯（heel 或 toe），专注引导-压刃-释放的三段动作。每次弯都在结束前放平板面。",
      "keyPoints": ["分段动作控制", "完整的压刃循环"]
    },
    {
      "name_en": "Pendulum / Falling Leaf",
      "name_cn": "叶片滑",
      "description": "在斜坡上左右摆动练刃角切换，不用全转弯。专注重心沿板子中心线移动，不要上下摆。",
      "keyPoints": ["刃角切换", "重心控制"]
    }
  ]
}

请根据上述教练反馈中识别出的具体技术问题，推荐最相关的练习。所有文字使用简体中文。`;

  try {
    console.log('[Practice] Generating practice recommendations...');
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const practiceData = JSON.parse(jsonText);
    console.log('[Practice] ✅ Generated', practiceData.recommendations?.length || 0, 'practice recommendations');
    return practiceData.recommendations || [];
  } catch (error) {
    console.error('[Practice] ❌ Error generating recommendations:', error);
    // Return default recommendations based on sport
    return getDefaultRecommendations(sport);
  }
}

// Default practice recommendations fallback
function getDefaultRecommendations(sport) {
  if (sport === 'snowboard') {
    return [
      {
        name_en: "Nose Pressure Drill",
        name_cn: "板头压力练习",
        description: "直滑时轻压前脚，让板头保持引导感。熟练后应用于转弯入弯瞬间。",
        keyPoints: ["保持前脚压力", "板头引导转向"]
      },
      {
        name_en: "J-turn",
        name_cn: "半弯练习",
        description: "练单边弯（heel 或 toe），专注\"引导–压刃–释放\"的三段动作。每次弯都在结束前放平板面。",
        keyPoints: ["分段动作控制", "完整的压刃循环"]
      },
      {
        name_en: "Pendulum / Falling Leaf",
        name_cn: "叶片滑",
        description: "在斜坡上左右摆动练刃角切换，不用全转弯。专注重心沿板子中心线移动，不要上下摆。",
        keyPoints: ["刃角切换", "重心控制"]
      }
    ];
  } else {
    return [
      {
        name_en: "Basic Parallel Turn",
        name_cn: "基础平行转弯",
        description: "练习保持双板平行，通过身体重心转移来控制转弯。专注于上下身分离和边缘控制。",
        keyPoints: ["双板平行", "重心转移"]
      },
      {
        name_en: "Edging Exercise",
        name_cn: "板刃控制练习",
        description: "在缓坡上练习切入和释放边缘，感受板刃对雪面的抓地力变化。",
        keyPoints: ["边缘控制", "压力管理"]
      }
    ];
  }
}

// Routes
app.post('/api/upload', (req, res) => {
  upload.single('video')(req, res, async (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || '文件上传失败' });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: '未提供视频文件' });
      }

      const sport = req.body.sport || 'ski';
      const terrain = req.body.terrain || 'blue';
      const duration = parseFloat(req.body.duration) || 30;
      
      // Get video metadata (duration, fps, frame count)
      console.log('[Upload] Getting video metadata...');
      let videoMetadata;
      try {
        videoMetadata = await getVideoMetadata(req.file.path);
        console.log(`[Upload] Video metadata: duration=${videoMetadata.duration}s, fps=${videoMetadata.fps}, frames=${videoMetadata.frameCount}`);
      } catch (error) {
        console.error('[Upload] Error getting metadata, using defaults:', error);
        videoMetadata = { duration, fps: 30, frameCount: Math.floor(duration * 30) };
      }
      
      // Segment the video based on motion analysis
      console.log('[Upload] Analyzing motion and segmenting video...');
      const scenes = await segmentVideoWithMotion(req.file.path, videoMetadata.duration, videoMetadata.fps);
      console.log(`[Upload] Created ${scenes.length} segments based on motion analysis`);
      
      // Generate coaching analysis
      console.log(`[Upload] Starting coaching analysis for ${sport} video, terrain: ${terrain}, ${scenes.length} scenes`);
      const coachingData = await generateCoachingAnalysis(scenes, sport, req.file.path, videoMetadata.fps, terrain);
      console.log(`[Upload] Coaching analysis complete, generated ${coachingData.scenes?.length || 0} coaching windows`);
      
      // Generate practice recommendations
      console.log('[Upload] Generating practice recommendations...');
      const practiceRecommendations = await generatePracticeRecommendations(sport, coachingData);
      console.log('[Upload] Practice recommendations generated');
      
      // Store video data
      const videoId = Date.now().toString();
      const videoUrl = `/uploads/${req.file.filename}`;
      
      videoData.set(videoId, {
        id: videoId,
        filename: req.file.filename,
        path: req.file.path,
        url: videoUrl,
        sport: sport,
        terrain: terrain,
        duration: videoMetadata.duration,
        fps: videoMetadata.fps,
        scenes: scenes,
        coaching: coachingData,
        practiceRecommendations: practiceRecommendations
      });

      res.json({
        videoId: videoId,
        url: videoUrl,
        duration: videoMetadata.duration,
        fps: videoMetadata.fps,
        coaching: coachingData,
        practiceRecommendations: practiceRecommendations,
        sport: sport,
        terrain: terrain
      });
    } catch (error) {
      console.error('[Upload] ❌ Error:', error.message);
      console.error('[Upload] Error stack:', error.stack);
      
      // If it's a Gemini API error, provide helpful message
      if (error.message.includes('Gemini API error')) {
        res.status(500).json({ 
          error: error.message,
          details: 'AI分析服务无响应。请检查您的API密钥或稍后重试。'
        });
      } else {
        res.status(500).json({ error: error.message || '上传过程中发生错误' });
      }
    }
  });
});

app.get('/api/video/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  const data = videoData.get(videoId);
  
  if (!data) {
      return res.status(404).json({ error: '未找到视频' });
  }
  
  res.json(data);
});

app.get('/api/video/:videoId/coaching', (req, res) => {
  const videoId = req.params.videoId;
  const data = videoData.get(videoId);
  
  if (!data) {
      return res.status(404).json({ error: '未找到视频' });
  }
  
  res.json(data.coaching);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

