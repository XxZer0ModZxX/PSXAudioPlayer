const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;

function onYouTubeIframeAPIReady() {
    // Music Player - Forced to lowest possible RAM usage
    musicPlayer = new YT.Player('yt-music', {
        height: '4', width: '4',
        playerVars: { 'listType': 'playlist', 'list': MUSIC_PLAYLIST_ID, 'playsinline': 1, 'controls': 0 },
        events: { 
            'onReady': (e) => e.target.setPlaybackQuality('small'),
            'onStateChange': onMusicStateChange 
        }
    });

    // Visuals Player - Only cued, not loaded yet to save RAM
    visualsPlayer = new YT.Player('yt-visuals', {
        height: '100%', width: '100%',
        playerVars: { 'controls': 0, 'modestbranding': 1, 'playsinline': 1 },
        events: { 
            'onReady': (e) => {
                e.target.mute();
                e.target.setPlaybackQuality('medium'); // 360p/480p is safer for RAM
            }
        }
    });
}

function onMusicStateChange(event) {
    // If music stops or errors due to an ad/switch, kick it back on
    if (event.data === YT.PlayerState.PAUSED && !document.getElementById('start-overlay')) {
        musicPlayer.playVideo();
    }
}

document.getElementById('start-overlay').onclick = function() {
    musicPlayer.playVideo();
    this.style.display = 'none';
};

// MUSIC CONTROLS
document.getElementById('btn-play').onclick = () => musicPlayer.playVideo();
document.getElementById('btn-pause').onclick = () => musicPlayer.pauseVideo();
document.getElementById('btn-stop').onclick = () => musicPlayer.stopVideo();

// VISUALS TOGGLE (The "Safe Load" Logic)
document.getElementById('btn-viz-toggle').onclick = function() {
    // 1. Show the layer
    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // 2. Load the video ONLY now to prevent the double-ad crash
    visualsPlayer.loadVideoById({
        videoId: VISUALS_VIDEO_ID,
        suggestedQuality: 'medium'
    });

    // 3. Keep the music speck alive
    setTimeout(() => {
        musicPlayer.playVideo();
    }, 1000); // Wait 1 full second for the video/ad to initialize
    
    showBackButton();
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    
    // Stop the visuals stream entirely to free up RAM for the music player
    visualsPlayer.stopVideo(); 
    musicPlayer.playVideo();
};

// Standard Idle Timer for Back Button
function showBackButton() {
    const ui = document.getElementById('video-ui-overlay');
    ui.classList.remove('hidden');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (document.getElementById('yt-visuals').classList.contains('active')) {
            ui.classList.add('hidden');
        }
    }, 3000);
}
