let selectedSport = null;
let selectedTerrain = null;
let selectedFile = null;

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
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressFill.style.width = percentComplete + '%';
                    progressText.textContent = `上传中... ${Math.round(percentComplete)}%`;
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    // Redirect to analysis page with video data
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
                } else {
                    // Try to parse error message from response
                    let errorMessage = '上传失败，请重试。';
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        errorMessage = errorResponse.error || errorMessage;
                    } catch (e) {
                        errorMessage = `上传失败（状态码 ${xhr.status}），请重试。`;
                    }
                    alert(errorMessage);
                    uploadProgress.style.display = 'none';
                    uploadBtn.disabled = false;
                }
            });

            xhr.addEventListener('error', () => {
                alert('网络错误，请检查您的连接后重试。');
                uploadProgress.style.display = 'none';
                uploadBtn.disabled = false;
            });

            xhr.open('POST', '/api/upload');
            xhr.send(formData);
        } catch (error) {
            console.error('Upload error:', error);
            alert('上传失败，请重试。');
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

