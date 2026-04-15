const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const VISUALS_VIDEO_ID = "EColTNIbOko"; 

let musicPlayer, visualsPlayer;
let idleTimer;

// Create both players
function onYouTubeIframeAPIReady() {
    // Music Player (Audio only, tiny quality)
    musicPlayer = new YT.Player('yt-music', {
        height: '1', width: '1',
        playerVars: { 'listType': 'playlist', 'list': MUSIC_PLAYLIST_ID, 'playsinline': 1, 'controls': 0 },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('tiny') }
    });

    // Visuals Player (Video only, HD quality)
    visualsPlayer = new YT.Player('yt-visuals', {
        height: '100%', width: '100%',
        playerVars: { 'autoplay': 0, 'controls': 0, 'modestbranding': 1, 'loop': 1, 'playlist': VISUALS_VIDEO_ID },
        events: { 'onReady': (e) => e.target.setPlaybackQuality('hd720') }
    });
}

// Power On
document.getElementById('start-overlay').onclick = function() {
    musicPlayer.playVideo();
    visualsPlayer.playVideo(); 
    setTimeout(() => { 
        musicPlayer.pauseVideo();
        visualsPlayer.pauseVideo(); 
        visualsPlayer.mute(); // Ensure the 10h test video stays silent
    }, 500);
    this.style.display = 'none';
};

// MUSIC CONTROLS (Targeting MusicPlayer)
document.getElementById('btn-open').onclick = () => musicPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
document.getElementById('btn-play').onclick = () => musicPlayer.playVideo();
document.getElementById('btn-stop').onclick = () => musicPlayer.stopVideo();
document.getElementById('btn-pause').onclick = () => musicPlayer.pauseVideo();
document.getElementById('btn-next').onclick = () => musicPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => musicPlayer.previousVideo();

// VISUALS TOGGLE
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('yt-visuals').classList.add('active');
    document.getElementById('main-ui').classList.add('hidden');
    visualsPlayer.playVideo(); 
    showBackButton();
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('yt-visuals').classList.remove('active');
    document.getElementById('main-ui').classList.remove('hidden');
    document.getElementById('video-ui-overlay').classList.add('hidden');
    // Note: Music player keeps playing in the background!
};

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
