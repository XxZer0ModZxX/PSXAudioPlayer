const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;
let isVisualsLoading = false;

function onYouTubeIframeAPIReady() {
    // Music Player
    musicPlayer = new YT.Player('yt-music', {
        height: '1', width: '1',
        playerVars: { 'listType': 'playlist', 'list': MUSIC_PLAYLIST_ID, 'playsinline': 1, 'controls': 0 },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('tiny') }
    });

    // Visuals Player
    visualsPlayer = new YT.Player('yt-visuals', {
        height: '100%', width: '100%',
        playerVars: { 'autoplay': 0, 'controls': 0, 'modestbranding': 1, 'loop': 1, 'playlist': VISUALS_VIDEO_ID, 'playsinline': 1 },
        events: { 
            'onReady': (e) => {
                e.target.mute(); 
                e.target.setPlaybackQuality('hd720');
            }
        }
    });
}

// POWER ON HANDSHAKE
document.getElementById('start-overlay').onclick = function() {
    // Warm up both engines immediately
    musicPlayer.playVideo();
    visualsPlayer.playVideo();
    setTimeout(() => { 
        musicPlayer.pauseVideo();
        visualsPlayer.pauseVideo();
    }, 600);
    this.style.display = 'none';
};

// UNIFIED PLAY BUTTON
document.getElementById('btn-play').onclick = function() {
    musicPlayer.playVideo();
    // Start visuals in the background so they are ready when we switch
    visualsPlayer.playVideo(); 
};

// VISUALS TOGGLE (The "Curtain" Move)
document.getElementById('btn-viz-toggle').onclick = function() {
    // Ensure visuals are playing before we show them
    if (visualsPlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
        visualsPlayer.playVideo();
    }

    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // Tiny delay to let the PS5 handle the layer swap, then reinforce music
    setTimeout(() => { musicPlayer.playVideo(); }, 100);
    
    showBackButton();
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    // We leave the visuals playing in the background so they don't have to reload!
};

// OTHER CONTROLS
document.getElementById('btn-open').onclick = () => musicPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
document.getElementById('btn-stop').onclick = () => { musicPlayer.stopVideo(); visualsPlayer.stopVideo(); };
document.getElementById('btn-pause').onclick = () => { musicPlayer.pauseVideo(); visualsPlayer.pauseVideo(); };
document.getElementById('btn-next').onclick = () => musicPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => musicPlayer.previousVideo();

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
