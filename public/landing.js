let selectedSport = null;
let selectedTerrain = null;
let selectedFile = null;

// API_BASE detection function - must be defined before DOMContentLoaded
function getApiBase() {
    // If accessing locally (localhost), use local backend directly
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';
    
    if (isLocal) {
        const localBase = `http://${window.location.hostname}:${window.location.port || 3000}`;
        console.log('[API] 本地访问，使用本地后端:', localBase);
        return localBase;
    }
    
    // For Vercel/production, check URL params and localStorage
    const params = new URLSearchParams(window.location.search);
    if (params.get('clearApiBase') === '1') {
        localStorage.removeItem('apiBase');
        console.log('[API] 已清除存储的API_BASE');
    }
    const fromQuery = params.get('apiBase');
    console.log('[API] URL参数中的apiBase:', fromQuery);
    
    if (fromQuery) {
        try {
            // Ensure URL has protocol
            let url = fromQuery.trim();
            // Remove any trailing slashes
            url = url.replace(/\/+$/, '');
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            const u = new URL(url);
            const apiBase = u.origin;
            localStorage.setItem('apiBase', apiBase);
            console.log('[API] 从URL参数设置API_BASE:', apiBase);
            return apiBase;
        } catch (e) {
            console.error('[API] URL解析错误:', e, '原始URL:', fromQuery);
        }
    }
    const stored = localStorage.getItem('apiBase');
    if (stored) {
        console.log('[API] 使用存储的API_BASE:', stored);
        return stored;
    }
    console.warn('[API] 未找到API_BASE，将使用Vercel blob上传');
    return '';
}

// Show API indicator immediately when script loads (before DOM ready)
(function() {
    'use strict';
    const apiBase = getApiBase();
    const urlParam = new URLSearchParams(window.location.search).get('apiBase');
    
    function createIndicator() {
        // Remove existing
        const existing = document.getElementById('apiIndicator');
        if (existing) existing.remove();
        
        const indicator = document.createElement('div');
        indicator.id = 'apiIndicator';
        indicator.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #00d4aa; color: #1a1a1a; padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; z-index: 10000; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-family: monospace;';
        
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '';
        
        if (apiBase) {
            const displayText = isLocal 
                ? `🔗 本地: ${apiBase.replace('http://', '')}`
                : `🔗 ${apiBase.replace('https://', '').substring(0, 35)}`;
            indicator.textContent = displayText;
            indicator.title = apiBase;
            indicator.style.background = '#00d4aa';
            console.log('[API] ✅ 检测到后端地址:', apiBase);
        } else if (urlParam) {
            indicator.textContent = '❌ API解析失败';
            indicator.title = `URL参数: ${urlParam}`;
            indicator.style.background = '#ff6b6b';
            indicator.style.color = 'white';
            console.error('[API] ❌ URL参数存在但解析失败:', urlParam);
        } else {
            indicator.textContent = '⚠️ 使用Vercel';
            indicator.style.background = '#ffa500';
            console.warn('[API] ⚠️ 未检测到apiBase参数');
        }
        
        document.body.appendChild(indicator);
    }
    
    // Try to create immediately
    if (document.body) {
        createIndicator();
    } else {
        // Wait for body to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createIndicator);
        } else {
            // DOM already ready
            setTimeout(createIndicator, 0);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const sportButtons = document.querySelectorAll('.sport-btn');
    const uploadSection = document.getElementById('uploadSection');
    const uploadArea = document.getElementById('uploadArea');
    const videoInput = document.getElementById('videoInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const selectedSportDisplay = document.getElementById('selectedSport');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const terrainSection = document.getElementById('terrainSection');
    const terrainButtons = document.querySelectorAll('.terrain-btn');
    const selectedTerrainDisplay = document.getElementById('selectedTerrain');

    // Sport selection
    sportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sportButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSport = btn.dataset.sport;
            terrainSection.style.display = 'block';
            selectedSportDisplay.textContent = `已选择：${selectedSport === 'ski' ? '⛷️ 双板' : '🏂 单板'}`;
            // Reset terrain selection when sport changes
            selectedTerrain = null;
            terrainButtons.forEach(b => b.classList.remove('selected'));
            selectedTerrainDisplay.textContent = '';
            uploadSection.style.display = 'none';
        });
    });

    // Terrain selection
    terrainButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            terrainButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTerrain = btn.dataset.terrain;
            
            const terrainNames = {
                'flat': '平地 / 绿道（初级）',
                'blue': '蓝道（中级）',
                'black': '黑道（高级陡坡）',
                'mogul': '蘑菇道（雪包地形）',
                'freestyle': '自由式（公园、跳台、道具）'
            };
            
            selectedTerrainDisplay.textContent = `已选择地形：${terrainNames[selectedTerrain]}`;
            uploadSection.style.display = 'block';
        });
    });

    // File input click
    uploadArea.addEventListener('click', () => {
        videoInput.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // File input change
    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        // Validate file type by extension and MIME type
        const allowedExtensions = ['.mp4', '.mov', '.avi', '.webm'];
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        const hasValidMimeType = allowedTypes.includes(file.type);
        
        if (!hasValidExtension && !hasValidMimeType) {
            alert(`请选择有效的视频文件（MP4、MOV、AVI、WEBM）。\n所选文件：${file.name}\n文件类型：${file.type || '未知'}`);
            return;
        }

        // Validate file size (100MB)
        if (file.size > 100 * 1024 * 1024) {
            alert('文件大小必须小于 100MB');
            return;
        }

        selectedFile = file;
        uploadArea.querySelector('.upload-text').textContent = `已选择：${file.name}`;
        uploadBtn.disabled = false;
    }

    // API_BASE is now defined globally above, so we can use it here
    const API_BASE = getApiBase();

    // Upload button
    uploadBtn.addEventListener('click', async () => {
        if (!selectedSport || !selectedTerrain || !selectedFile) {
            alert('请选择运动项目、地形和视频文件');
            return;
        }

        // Get video duration
        const duration = await getVideoDuration(selectedFile);
        
        // Upload file
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('sport', selectedSport);
        formData.append('terrain', selectedTerrain);
        formData.append('duration', duration.toString());

        uploadProgress.style.display = 'block';
        uploadBtn.disabled = true;

        try {
            // Re-check API_BASE in case it was updated
            const currentApiBase = getApiBase();
            const urlParam = new URLSearchParams(window.location.search).get('apiBase');
            const useLocalBackend = !!currentApiBase;
            
            console.log('[Upload] 🔍 API_BASE检查:', {
                apiBase: currentApiBase,
                useLocalBackend: useLocalBackend,
                urlParams: urlParam,
                localStorage: localStorage.getItem('apiBase')
            });
            
            if (!currentApiBase && urlParam) {
                console.error('[Upload] ❌ 错误：URL参数中有apiBase但未解析成功！', urlParam);
                alert(`API_BASE解析失败！\nURL参数: ${urlParam}\n\n请检查URL格式是否正确，或尝试刷新页面。`);
                throw new Error('API_BASE解析失败');
            }
            
            if (useLocalBackend) {
                console.log(`[Upload] ✅ 使用本地后端: ${currentApiBase}/api/upload`);
                
                // Show progress for ngrok upload
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressFill.style.width = percentComplete + '%';
                        progressText.textContent = `上传中... ${Math.round(percentComplete)}%`;
                    }
                });
                
                return new Promise((resolve, reject) => {
                    xhr.addEventListener('load', () => {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                console.log('[Upload] 上传成功:', response);
                                sessionStorage.setItem('videoData', JSON.stringify({
                                    videoId: response.videoId,
                                    url: `${currentApiBase}${response.url}`,
                                    duration: response.duration,
                                    fps: response.fps || 30,
                                    coaching: response.coaching,
                                    practiceRecommendations: response.practiceRecommendations || [],
                                    sport: selectedSport,
                                    terrain: selectedTerrain,
                                    apiBase: currentApiBase
                                }));
                                window.location.href = 'analyze.html';
                                resolve();
                            } catch (e) {
                                console.error('[Upload] JSON解析错误:', e);
                                reject(new Error('响应解析失败'));
                            }
                        } else {
                            console.error('[Upload] 上传失败，状态码:', xhr.status, '响应:', xhr.responseText);
                            reject(new Error(`上传失败（状态码 ${xhr.status}）: ${xhr.responseText.substring(0, 100)}`));
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        console.error('[Upload] 网络错误');
                        reject(new Error('网络错误，请检查ngrok连接'));
                    });
                    
                    xhr.open('POST', `${currentApiBase}/api/upload`);
                    // Add ngrok skip browser warning header
                    xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
                    xhr.send(formData);
                });
            }
            
            // Vercel blob upload path (fallback) - should not reach here if API_BASE is set
            const urlParamCheck = new URLSearchParams(window.location.search).get('apiBase');
            if (urlParamCheck) {
                console.error('[Upload] ❌ 严重错误：URL参数中有apiBase但代码走到了Vercel上传路径！');
                console.error('[Upload] 这不应该发生，请检查getApiBase()函数');
                alert(`配置错误：检测到apiBase参数但未使用！\n\nURL参数: ${urlParamCheck}\n\n请刷新页面重试，或检查浏览器控制台。`);
                throw new Error('API_BASE配置错误：URL参数存在但未使用');
            }
            
            console.warn('[Upload] ⚠️ 未检测到API_BASE，尝试使用Vercel blob上传（这需要BLOB_READ_WRITE_TOKEN）');
            const urlRes = await fetch('/api/blob-upload-url', { method: 'POST' });
            if (!urlRes.ok) {
                const errorText = await urlRes.text();
                console.error('[Upload] ❌ Vercel blob上传失败:', urlRes.status, errorText);
                throw new Error(`获取上传链接失败（状态码 ${urlRes.status}）。\n\n请确保URL中包含 apiBase 参数，例如:\n?apiBase=https://your-ngrok-url.ngrok-free.dev\n\n当前URL: ${window.location.href}`);
            }
            const { uploadURL } = await urlRes.json();

            const putRes = await fetch(uploadURL, {
                method: 'PUT',
                headers: { 'Content-Type': selectedFile.type },
                body: selectedFile
            });
            if (!putRes.ok) {
                throw new Error(`上传到存储失败（状态码 ${putRes.status}）`);
            }
            let blobUrl = putRes.headers.get('location') || putRes.headers.get('Location');
            if (!blobUrl) {
                try {
                    const putJson = await putRes.json();
                    blobUrl = putJson?.url || (putJson?.pathname ? `https://blob.vercel-storage.com${putJson.pathname}` : null);
                } catch (_) {
                    // ignore parse error
                }
            }
            if (!blobUrl) {
                throw new Error('无法获取文件URL');
            }

            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blobUrl, sport: selectedSport, terrain: selectedTerrain, duration })
            });
            if (!analyzeRes.ok) {
                throw new Error('分析失败');
            }
            const response = await analyzeRes.json();
            sessionStorage.setItem('videoData', JSON.stringify({
                videoId: response.videoId,
                url: response.url,
                duration: response.duration,
                fps: response.fps || 30,
                coaching: response.coaching,
                practiceRecommendations: response.practiceRecommendations || [],
                sport: selectedSport,
                terrain: selectedTerrain
            }));
            window.location.href = 'analyze.html';
        } catch (error) {
            console.error('Upload error:', error);
            alert(`上传失败：${error?.message || '请重试。'}`);
            uploadProgress.style.display = 'none';
            uploadBtn.disabled = false;
        }
    });

    function getVideoDuration(file) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            
            video.onerror = () => {
                resolve(30); // Default to 30 seconds if can't determine
            };
            
            video.src = URL.createObjectURL(file);
        });
    }
});
