const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const GITHUB_BASE = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/";
let currentTrack = "Track01.mp3";

// 1. THE UNLOCKER
startOverlay.onclick = () => {
    // Unmute and play whatever is there (currently nothing)
    audioEngine.muted = false;
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC (The Selector)
btnLoadSong.onclick = () => {
    // Just prepares the URL, doesn't play yet
    currentTrack = "Track01.mp3";
    console.log("Track Queued: " + currentTrack);
};

// 3. THE MASTER PLAY BUTTON
btnPlay.onclick = () => {
    const targetUrl = GITHUB_BASE + currentTrack;
    
    // Check if we need to change the source
    if (audioEngine.src !== targetUrl) {
        audioEngine.src = targetUrl;
        audioEngine.load();
    }
    
    // Direct playback call - MUST happen inside the click event
    audioEngine.play().then(() => {
        console.log("Audio playing successfully");
    }).catch(e => {
        // Fallback: If blocked, try to force it one more time
        audioEngine.muted = false;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
};

/**
 * BIOS AND VIZ LOGIC
 */
btnOpenBios.onclick = async () => {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        const biosBuffer = await response.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(biosBuffer);
    } catch (e) {}
};

document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    const viz = document.getElementById('visualizer-overlay');
    viz.classList.remove('hidden');
    viz.classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
};
