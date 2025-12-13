let videoPlayer;
let coachingWindows = [];
let currentVideoTime = 0;
let isPausedByWindow = false;
let displayedWindows = new Set();
let videoData = null;

document.addEventListener('DOMContentLoaded', () => {
    videoPlayer = document.getElementById('videoPlayer');
    
    // Get video data from sessionStorage
    const storedData = sessionStorage.getItem('videoData');
    if (!storedData) {
        window.location.href = 'index.html';
        return;
    }

    videoData = JSON.parse(storedData);
    
    // Get API base for video URL
    const API_BASE = videoData.apiBase || '';
    
    // Show loading state
    const container = document.getElementById('coachingWindows');
    container.innerHTML = '<div class="loading">正在加载视频和分析...</div>';
    
    // Set video source - use full URL if API_BASE is set
    const videoUrl = videoData.url.startsWith('http') ? videoData.url : (API_BASE + videoData.url);
    document.getElementById('videoSource').src = videoUrl;
    videoPlayer.load();
    
    // Clear loading state once video is ready
    videoPlayer.addEventListener('canplay', () => {
        if (container.querySelector('.loading')) {
            container.innerHTML = '';
        }
    }, { once: true });

    // Initialize coaching windows
    if (videoData.coaching && videoData.coaching.scenes) {
        coachingWindows = videoData.coaching.scenes.map(scene => ({
            ...scene,
            displayed: false
        })).sort((a, b) => a.freeze_at - b.freeze_at);
    }

    // Video event listeners
    videoPlayer.addEventListener('loadedmetadata', () => {
        updateTotalTime();
    });

    videoPlayer.addEventListener('timeupdate', () => {
        currentVideoTime = videoPlayer.currentTime;
        updateCurrentTime();
        checkForNewWindows();
    });

    videoPlayer.addEventListener('play', () => {
        isPausedByWindow = false;
        document.getElementById('playPauseBtn').textContent = '⏸️ 暂停';
    });

    videoPlayer.addEventListener('pause', () => {
        if (!isPausedByWindow) {
            document.getElementById('playPauseBtn').textContent = '▶️ 播放';
        }
    });

    // Play/Pause button handler
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            // Resume playback
            isPausedByWindow = false;
            videoPlayer.play();
        } else {
            // Pause playback
            videoPlayer.pause();
        }
    });

    // Listen for video end to show practice recommendations
    videoPlayer.addEventListener('ended', () => {
        showPracticeRecommendations();
    });

    // Start playing the video automatically
    videoPlayer.play();
});

function updateCurrentTime() {
    const time = formatTime(currentVideoTime);
    document.getElementById('currentTime').textContent = time;
}

function updateTotalTime() {
    const time = formatTime(videoPlayer.duration);
    document.getElementById('totalTime').textContent = time;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function checkForNewWindows() {
    // Only check if video is playing (not already paused by a window)
    if (isPausedByWindow) return;
    
    coachingWindows.forEach(window => {
        // Check if we've reached or passed the freeze_at time and window hasn't been displayed
        if (currentVideoTime >= window.freeze_at && !displayedWindows.has(window.id)) {
            displayCoachingWindow(window);
            displayedWindows.add(window.id);
        }
    });
}

function displayCoachingWindow(windowData) {
    // IMPORTANT: Freeze video at freeze_at timestamp when new window appears
    videoPlayer.pause();
    videoPlayer.currentTime = windowData.freeze_at;
    isPausedByWindow = true;
    document.getElementById('playPauseBtn').textContent = '▶️ 播放';

    // Create coaching window element
    const windowElement = document.createElement('div');
    windowElement.className = 'coaching-window new';
    windowElement.dataset.windowId = windowData.id;
    windowElement.dataset.freezeTime = windowData.freeze_at;

    windowElement.innerHTML = `
        <div class="coaching-window-header">
            <div class="coaching-window-title">${windowData.title}</div>
            <div class="coaching-window-timestamp">${formatTime(windowData.freeze_at)}</div>
        </div>
        <div class="coaching-window-text">${windowData.coaching_text}</div>
    `;

    // Add click handler to show the frame this window refers to
    windowElement.addEventListener('click', () => {
        // Jump to the exact freeze_at time and pause to show the frame
        videoPlayer.currentTime = windowData.freeze_at;
        videoPlayer.pause();
        isPausedByWindow = true;
        document.getElementById('playPauseBtn').textContent = '▶️ 播放';
        
        // Remove highlight from all windows
        document.querySelectorAll('.coaching-window').forEach(w => {
            w.style.borderLeftWidth = '4px';
            w.style.backgroundColor = '#ffffff';
        });
        
        // Highlight the clicked window
        windowElement.style.borderLeftWidth = '6px';
        windowElement.style.borderLeftColor = '#00d4aa';
        windowElement.style.backgroundColor = '#f0f9f7';
    });

    // Insert at the top of coaching windows
    const container = document.getElementById('coachingWindows');
    container.insertBefore(windowElement, container.firstChild);

    // Remove 'new' class after animation completes
    setTimeout(() => {
        windowElement.classList.remove('new');
    }, 500);

    // Scroll to top to show new window
    container.scrollTop = 0;
}

function showPracticeRecommendations() {
    if (!videoData.practiceRecommendations || videoData.practiceRecommendations.length === 0) {
        return;
    }

    const container = document.getElementById('coachingWindows');
    const practiceSection = document.createElement('div');
    practiceSection.className = 'practice-recommendations';
    practiceSection.innerHTML = `
        <div class="practice-header">
            <h3>🎯 专项练习推荐</h3>
            <p class="practice-subtitle">根据您的技术分析，以下练习可以帮助您改进</p>
        </div>
        <div class="practice-list">
            ${videoData.practiceRecommendations.map((practice, index) => `
                <div class="practice-item">
                    <div class="practice-number">${index + 1}</div>
                    <div class="practice-content">
                        <div class="practice-title">
                            <span class="practice-name-cn">${practice.name_cn}</span>
                            <span class="practice-name-en">${practice.name_en}</span>
                        </div>
                        <p class="practice-description">${practice.description}</p>
                        <div class="practice-key-points">
                            <strong>练习重点：</strong>
                            <ul>
                                ${practice.keyPoints.map(point => `<li>${point}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Insert at the top
    container.insertBefore(practiceSection, container.firstChild);
    
    // Smooth scroll to show recommendations
    setTimeout(() => {
        practiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

