const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;

function onYouTubeIframeAPIReady() {
    musicPlayer = new YT.Player('yt-music', {
        height: '4', width: '4',
        playerVars: { 'listType': 'playlist', 'list': MUSIC_PLAYLIST_ID, 'playsinline': 1, 'controls': 0 },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('tiny') }
    });

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

// POWER ON
document.getElementById('start-overlay').onclick = function() {
    musicPlayer.playVideo();
    visualsPlayer.playVideo();
    setTimeout(() => { 
        musicPlayer.pauseVideo();
        visualsPlayer.pauseVideo();
    }, 600);
    this.style.display = 'none';
};

// PLAY
document.getElementById('btn-play').onclick = function() {
    musicPlayer.playVideo();
    visualsPlayer.playVideo(); 
};

// TOGGLE VISUALS
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    
    // Ensure the video is running
    visualsPlayer.playVideo();

    // FORCE RESUME: The browser just moved the video to the front.
    // We immediately tell the 4px "Music Speck" to resume.
    setTimeout(() => {
        musicPlayer.playVideo();
    }, 200);
    
    showBackButton();
};

// EXIT
document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    
    // Safety check to make sure music keeps rolling
    musicPlayer.playVideo();
};

// CONTROLS
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

document.body.addEventListener('mousemove', () => {
    if (document.getElementById('yt-visuals').classList.contains('active')) showBackButton();
});
