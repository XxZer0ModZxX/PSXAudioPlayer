const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const MUSIC_URL = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/Track01.mp3";
let audioBlobUrl = null;

/**
 * 1. THE SILENT HANDSHAKE
 * This is the most important part for PS5.
 */
startOverlay.onclick = () => {
    // We play a "Silent" data URI. This tells the PS5 the user wants audio.
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    
    audioEngine.play().then(() => {
        console.log("Audio Channel Unlocked");
        startOverlay.style.display = 'none';
    }).catch(() => {
        // If it fails, we still hide the overlay and hope for the best
        startOverlay.style.display = 'none';
    });
};

/**
 * 2. LOAD MUSIC (Download to RAM)
 */
btnLoadSong.onclick = async () => {
    console.log("Downloading track...");
    try {
        const response = await fetch(MUSIC_URL);
        if (!response.ok) throw new Error("File not found");
        
        const blob = await response.blob();
        
        // Convert raw data to local internal URL
        audioBlobUrl = URL.createObjectURL(blob);
        audioEngine.src = audioBlobUrl;
        audioEngine.load(); // Prepare the buffer
        
        alert("CD Loaded! Click the Play button.");
    } catch (e) {
        alert("Download failed. Check GitHub file names.");
    }
};

/**
 * 3. THE PLAY BUTTON
 */
btnPlay.onclick = () => {
    if (!audioEngine.src || audioEngine.src === "" || audioEngine.src.startsWith('data:')) {
        alert("No disc in tray. Click Load Music first.");
        return;
    }

    // Direct playback call
    audioEngine.play().then(() => {
        console.log("Playing...");
    }).catch(e => {
        // ULTIMATE FALLBACK: If blocked, try to "unmute" and play again
        audioEngine.muted = false;
        audioEngine.play();
        alert("System still blocking. Try tapping the background once, then click Play again.");
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS and UI Logic
document.getElementById('btn-open-bios').onclick = async () => {
    try {
        const res = await fetch('./bios/SCPH7501.BIN');
        const buf = await res.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(buf);
    } catch (e) {}
};

document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('main-ui').classList.remove('hidden');
};
