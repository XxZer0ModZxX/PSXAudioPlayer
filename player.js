const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;

function onYouTubeIframeAPIReady() {
    // Player A: Music
    musicPlayer = new YT.Player('yt-music', {
        height: '1', width: '1',
        playerVars: { 'listType': 'playlist', 'list': MUSIC_PLAYLIST_ID, 'playsinline': 1, 'controls': 0 },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('tiny') }
    });

    // Player B: Visuals
    visualsPlayer = new YT.Player('yt-visuals', {
        height: '100%', width: '100%',
        playerVars: { 'autoplay': 0, 'controls': 0, 'modestbranding': 1, 'loop': 1, 'playlist': VISUALS_VIDEO_ID, 'playsinline': 1 },
        events: { 
            'onReady': (e) => {
                e.target.mute(); // Keep visuals silent
                e.target.setPlaybackQuality('hd720');
            }
        }
    });
}

// 1. POWER ON: Warm up both engines
document.getElementById('start-overlay').onclick = function() {
    musicPlayer.playVideo();
    visualsPlayer.playVideo();
    setTimeout(() => { 
        musicPlayer.pauseVideo();
        visualsPlayer.pauseVideo();
    }, 600);
    this.style.display = 'none';
};

// 2. PLAY BUTTON: Starts both (Video stays at 0.01 opacity)
document.getElementById('btn-play').onclick = function() {
    musicPlayer.playVideo();
    visualsPlayer.playVideo(); 
};

// 3. VISUALS TOGGLE: The "Force Sync" Logic
document.getElementById('btn-viz-toggle').onclick = function() {
    // Bring Visuals to front
    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // Ensure the visuals are playing
    visualsPlayer.playVideo();

    // THE AGGRESSIVE FIX: 
    // Wait a tiny moment for the browser to try and pause the music,
    // then immediately force the music back on.
    setTimeout(() => {
        musicPlayer.playVideo();
    }, 150); 
    
    showBackButton();
};

// 4. EXIT VISUALS
document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    
    // We keep visuals playing at 0.01 opacity so they are ready for next time
    // But we re-verify music is still going
    musicPlayer.playVideo();
};

// 5. OTHER CONTROLS
document.getElementById('btn-open').onclick = () => musicPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
document.getElementById('btn-stop').onclick = () => { musicPlayer.stopVideo(); visualsPlayer.stopVideo(); };
document.getElementById('btn-pause').onclick = () => { musicPlayer.pauseVideo(); visualsPlayer.pauseVideo(); };
document.getElementById('btn-next').onclick = () => musicPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => musicPlayer.previousVideo();

// IDLE TIMER
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

document.body.addEventListener('mousemove', () => {
    if (document.getElementById('yt-visuals').classList.contains('active')) showBackButton();
});
