const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const MUSIC_URL = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/Track01.mp3";
let audioBlobUrl = null;

// 1. UNLOCK AUDIO CONTEXT
startOverlay.onclick = () => {
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD MUSIC (The Fetcher)
 * This downloads the file into the PS5's memory first.
 */
btnLoadSong.onclick = async () => {
    console.log("Downloading track...");
    try {
        const response = await fetch(MUSIC_URL);
        if (!response.ok) throw new Error("File not found");
        
        const blob = await response.blob();
        
        // Convert the raw data into a local internal URL
        audioBlobUrl = URL.createObjectURL(blob);
        audioEngine.src = audioBlobUrl;
        
        alert("CD Loaded! Press PLAY button.");
    } catch (e) {
        alert("Download failed. Check your GitHub file.");
    }
};

/**
 * 3. PLAY BUTTON
 */
btnPlay.onclick = () => {
    if (!audioEngine.src || audioEngine.src === "") {
        alert("No disc in tray. Click Load Music first.");
        return;
    }

    audioEngine.play().then(() => {
        console.log("Playing from Blob");
    }).catch(e => {
        alert("Playback blocked. Tap the screen center then Play again.");
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// UI Toggles
document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('main-ui').classList.remove('hidden');
};

// BIOS Logic
document.getElementById('btn-open-bios').onclick = async () => {
    try {
        const res = await fetch('./bios/SCPH7501.BIN');
        const buf = await res.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(buf);
    } catch (e) {}
};
