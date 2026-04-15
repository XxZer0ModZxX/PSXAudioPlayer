const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
let musicPlayer;
let idleTimer;

// Initialize the Music Player only (RAM Saver)
function onYouTubeIframeAPIReady() {
    musicPlayer = new YT.Player('yt-music', {
        height: '4', width: '4',
        playerVars: { 
            'listType': 'playlist', 
            'list': MUSIC_PLAYLIST_ID, 
            'playsinline': 1, 
            'controls': 0 
        },
        events: { 
            'onReady': (e) => e.target.setPlaybackQuality('small')
        }
    });
}

// Power On
document.getElementById('start-overlay').onclick = function() {
    musicPlayer.playVideo();
    setTimeout(() => { musicPlayer.pauseVideo(); }, 600);
    this.style.display = 'none';
};

// Controls for Music
document.getElementById('btn-play').onclick = () => musicPlayer.playVideo();
document.getElementById('btn-pause').onclick = () => musicPlayer.pauseVideo();
document.getElementById('btn-stop').onclick = () => musicPlayer.stopVideo();
document.getElementById('btn-next').onclick = () => musicPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => musicPlayer.previousVideo();
document.getElementById('btn-open').onclick = () => musicPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });

// VISUALS TOGGLE (The Ninja Switch)
document.getElementById('btn-viz-toggle').onclick = function() {
    const vizFrame = document.getElementById('yt-visuals');
    
    // 1. Swap UI Layers
    vizFrame.classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // 2. Play Video via postMessage (By-passes API overhead)
    vizFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');

    // 3. Keep Music Alive - Force resume after the layer shift
    setTimeout(() => { musicPlayer.playVideo(); }, 300);
    
    showBackButton();
};

document.getElementById('btn-exit-viz').onclick = function() {
    const vizFrame = document.getElementById('yt-visuals');
    
    vizFrame.classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    
    // STOP the video entirely to free up RAM for the PS5
    vizFrame.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    musicPlayer.playVideo();
};

// Smart Back Button
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
