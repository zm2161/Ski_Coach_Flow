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
    
    // If on Railway (same domain), use relative paths (no apiBase needed)
    const isRailway = window.location.hostname.includes('railway.app') || 
                      window.location.hostname.includes('up.railway.app');
    
    if (isRailway) {
        console.log('[API] Railway 同域部署，使用相对路径');
        return ''; // Empty string means use relative paths
    }
    
    // For Vercel/production with separate backend, check URL params and localStorage
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
        const isRailway = window.location.hostname.includes('railway.app') || 
                          window.location.hostname.includes('up.railway.app');
        
        if (isRailway && !apiBase) {
            // Railway same-domain deployment
            indicator.textContent = '✅ Railway 同域';
            indicator.title = '前端和后端在同一域名下';
            indicator.style.background = '#00d4aa';
            console.log('[API] ✅ Railway 同域部署');
        } else if (apiBase) {
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

        // Note: nginx limit is 1MB, so we'll use chunked upload for files > 500KB
        // This allows us to upload larger files by splitting them into smaller chunks
        const chunkSize = 500 * 1024; // 500KB per chunk (under nginx 1MB limit)
        const useChunkedUpload = file.size > chunkSize;
        
        if (file.size > 100 * 1024 * 1024) { // 100MB absolute max
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            alert(`文件太大（${sizeMB}MB）。\n最大支持: 100MB\n\n提示: 请压缩视频或使用更短的视频片段。`);
            return;
        }
        
        if (useChunkedUpload) {
            console.log(`[Upload] 文件大小 ${(file.size / 1024 / 1024).toFixed(2)}MB，将使用分块上传`);
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
            
            // Check if we need chunked upload (nginx limit is 1MB)
            const chunkSize = 500 * 1024; // 500KB per chunk (safe under 1MB nginx limit)
            const useChunkedUpload = selectedFile.size > chunkSize;
            
            if (useChunkedUpload) {
                console.log(`[Upload] 文件大小 ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB，使用分块上传`);
                await uploadFileInChunks(selectedFile, selectedSport, selectedTerrain, duration, currentApiBase);
            } else {
                console.log(`[Upload] 文件大小 ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB，使用普通上传`);
                await uploadFileDirect(selectedFile, selectedSport, selectedTerrain, duration, currentApiBase);
            }
        } catch (error) {
            console.error('[Upload] 上传失败:', error);
            alert(error.message || '上传失败，请重试');
            uploadProgress.style.display = 'none';
            uploadBtn.disabled = false;
        }
    });
    
    // Chunked upload function
    async function uploadFileInChunks(file, sport, terrain, duration, apiBase) {
        const chunkSize = 500 * 1024; // 500KB per chunk
        const totalChunks = Math.ceil(file.size / chunkSize);
        const uploadId = Date.now().toString();
        const fileName = file.name;
        
        const chunkUrl = apiBase ? `${apiBase}/api/upload-chunk` : '/api/upload-chunk';
        const mergeUrl = apiBase ? `${apiBase}/api/merge-chunks` : '/api/merge-chunks';
        
        console.log(`[Chunk Upload] 开始分块上传: ${totalChunks} 块, 每块 ${(chunkSize / 1024).toFixed(0)}KB`);
        
        // Upload chunks
        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', i.toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('fileName', fileName);
            formData.append('uploadId', uploadId);
            
            const chunkProgress = ((i + 1) / totalChunks) * 90; // 90% for upload, 10% for merge
            progressFill.style.width = chunkProgress + '%';
            progressText.textContent = `上传中... ${Math.round(chunkProgress)}% (块 ${i + 1}/${totalChunks})`;
            
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', chunkUrl);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        console.log(`[Chunk Upload] 块 ${i + 1}/${totalChunks} 上传成功`);
                        resolve();
                    } else {
                        reject(new Error(`块 ${i + 1} 上传失败: ${xhr.status}`));
                    }
                };
                xhr.onerror = () => reject(new Error(`块 ${i + 1} 上传网络错误`));
                xhr.send(formData);
            });
        }
        
        // Merge chunks
        progressText.textContent = '合并文件块...';
        progressFill.style.width = '95%';
        
        const mergeResponse = await fetch(mergeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uploadId: uploadId,
                fileName: fileName,
                sport: sport,
                terrain: terrain,
                duration: duration
            })
        });
        
        if (!mergeResponse.ok) {
            throw new Error(`合并失败: ${mergeResponse.status}`);
        }
        
        const response = await mergeResponse.json();
        console.log('[Chunk Upload] 合并成功:', response);
        
        progressText.textContent = '完成！';
        progressFill.style.width = '100%';
        
        // Build video URL
        const videoUrl = apiBase ? `${apiBase}${response.url}` : response.url;
        
        sessionStorage.setItem('videoData', JSON.stringify({
            videoId: response.videoId,
            url: videoUrl,
            duration: response.duration,
            fps: response.fps || 30,
            coaching: response.coaching,
            practiceRecommendations: response.practiceRecommendations || [],
            sport: selectedSport,
            terrain: selectedTerrain,
            apiBase: apiBase || ''
        }));
        
        setTimeout(() => {
            window.location.href = 'analyze.html';
        }, 500);
    }
    
    // Direct upload function (for small files)
    async function uploadFileDirect(file, sport, terrain, duration, apiBase) {
        const uploadUrl = apiBase ? `${apiBase}/api/upload` : '/api/upload';
        const isRailway = window.location.hostname.includes('railway.app') || 
                          window.location.hostname.includes('up.railway.app');
        
        console.log(`[Upload] ✅ 使用后端: ${uploadUrl}${isRailway ? ' (Railway 同域)' : ''}`);
        
        const formData = new FormData();
        formData.append('video', file);
        formData.append('sport', sport);
        formData.append('terrain', terrain);
        formData.append('duration', duration.toString());
        
        progressFill.style.width = '1%';
        progressText.textContent = '连接中...';
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let uploadStarted = false;
            const timeout = setTimeout(() => {
                if (!uploadStarted) {
                    xhr.abort();
                    reject(new Error('连接超时'));
                }
            }, 10000);
            
            xhr.upload.addEventListener('loadstart', () => {
                uploadStarted = true;
                clearTimeout(timeout);
                progressText.textContent = '上传中... 0%';
            });
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && e.total > 0) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    progressText.textContent = `上传中... ${Math.round(percentComplete)}%`;
                }
            });
            
            xhr.upload.addEventListener('load', () => {
                progressText.textContent = '处理中...';
            });
            
            xhr.addEventListener('load', () => {
                clearTimeout(timeout);
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        progressText.textContent = '完成！';
                        progressFill.style.width = '100%';
                        
                        const videoUrl = apiBase ? `${apiBase}${response.url}` : response.url;
                        
                        sessionStorage.setItem('videoData', JSON.stringify({
                            videoId: response.videoId,
                            url: videoUrl,
                            duration: response.duration,
                            fps: response.fps || 30,
                            coaching: response.coaching,
                            practiceRecommendations: response.practiceRecommendations || [],
                            sport: selectedSport,
                            terrain: selectedTerrain,
                            apiBase: apiBase || ''
                        }));
                        
                        setTimeout(() => {
                            window.location.href = 'analyze.html';
                        }, 500);
                        resolve();
                    } catch (e) {
                        reject(new Error('响应解析失败'));
                    }
                } else {
                    if (xhr.status === 413) {
                        reject(new Error('文件太大（413错误）。将自动使用分块上传重试。'));
                    } else {
                        reject(new Error(`上传失败（状态码 ${xhr.status}）`));
                    }
                }
            });
            
            xhr.addEventListener('error', () => {
                clearTimeout(timeout);
                reject(new Error('网络错误'));
            });
            
            xhr.timeout = 600000;
            xhr.open('POST', uploadUrl);
            xhr.send(formData);
        });
            
            // Should not reach here if API_BASE is set
            const urlParamCheck = new URLSearchParams(window.location.search).get('apiBase');
            if (urlParamCheck) {
                console.error('[Upload] ❌ 严重错误：URL参数中有apiBase但代码走到了fallback路径！');
                console.error('[Upload] 这不应该发生，请检查getApiBase()函数');
                alert(`配置错误：检测到apiBase参数但未使用！\n\nURL参数: ${urlParamCheck}\n\n请刷新页面重试，或检查浏览器控制台。`);
                throw new Error('API_BASE配置错误：URL参数存在但未使用');
            }
            
            // No API_BASE and no localhost - cannot upload
            console.error('[Upload] ❌ 错误：未检测到API_BASE，无法上传');
            throw new Error('未配置后端地址。请在URL中添加 apiBase 参数，例如:\n?apiBase=https://your-localtunnel-url.loca.lt');
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
