const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;

// 1. INITIALIZE BOTH PLAYERS
function onYouTubeIframeAPIReady() {
    // Player A: The Music
    musicPlayer = new YT.Player('yt-music', {
        height: '1', width: '1',
        playerVars: { 
            'listType': 'playlist', 
            'list': MUSIC_PLAYLIST_ID, 
            'playsinline': 1, 
            'controls': 0,
            'enablejsapi': 1 
        },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('tiny') }
    });

    // Player B: The Visuals
    visualsPlayer = new YT.Player('yt-visuals', {
        height: '100%', width: '100%',
        playerVars: { 
            'autoplay': 0, 
            'controls': 0, 
            'modestbranding': 1, 
            'loop': 1, 
            'playlist': VISUALS_VIDEO_ID,
            'playsinline': 1,
            'enablejsapi': 1
        },
        events: { 
            'onReady': (e) => {
                e.target.setPlaybackQuality('hd720');
                e.target.mute(); // Crucial: Mute visuals so they don't fight the music
            } 
        }
    });
}

// 2. POWER ON HANDSHAKE
document.getElementById('start-overlay').onclick = function() {
    if (musicPlayer && visualsPlayer) {
        musicPlayer.playVideo();
        visualsPlayer.playVideo();
        setTimeout(() => { 
            musicPlayer.pauseVideo();
            visualsPlayer.pauseVideo();
        }, 600);
    }
    this.style.display = 'none';
};

// 3. VISUALS TOGGLE (THE FIX IS HERE)
document.getElementById('btn-viz-toggle').onclick = function() {
    const musicState = musicPlayer.getPlayerState(); // Check if music was already playing
    
    // Bring Visuals to Front
    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // Start the Visuals
    visualsPlayer.playVideo();
    
    // NINJA FIX: Force the music player to stay/resume playing 
    // We wait 500ms for the browser to finish the "auto-pause" logic
    setTimeout(() => {
        if (musicState === YT.PlayerState.PLAYING) {
            musicPlayer.playVideo(); 
        }
    }, 500);

    showBackButton();
};

// 4. EXIT VISUALS
document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    
    visualsPlayer.pauseVideo();
    // Music continues uninterrupted!
};

// 5. STANDARD CONTROLS (Targeting Music Player)
document.getElementById('btn-open').onclick = () => musicPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
document.getElementById('btn-play').onclick = () => musicPlayer.playVideo();
document.getElementById('btn-stop').onclick = () => musicPlayer.stopVideo();
document.getElementById('btn-pause').onclick = () => musicPlayer.pauseVideo();
document.getElementById('btn-next').onclick = () => musicPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => musicPlayer.previousVideo();

// IDLE TIMER FOR BACK BUTTON
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
