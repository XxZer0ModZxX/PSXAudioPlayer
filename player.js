const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// Direct relative path
const TRACK_PATH = "./music/Track01.mp3";

// 1. UNLOCK THE AUDIO CONTEXT
startOverlay.onclick = () => {
    // Basic "wake up" for the browser
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD MUSIC
 * We set the source directly. No fetching, no blobs.
 */
btnLoadSong.onclick = () => {
    // Set the source directly to the file path
    audioEngine.src = TRACK_PATH;
    audioEngine.load(); 
    
    // Give the UI some feedback
    btnLoadSong.style.border = "2px solid white";
    
    // Try to play immediately
    audioEngine.play().then(() => {
        btnLoadSong.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
    }).catch(e => {
        // If it's blocked, we wait for the Play button
        btnLoadSong.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
    });
};

/**
 * 3. PLAY BUTTON
 */
btnPlay.onclick = () => {
    if (audioEngine.src) {
        audioEngine.play().catch(e => {
            // Final attempt: Toggle mute to bypass policy
            audioEngine.muted = false;
            audioEngine.play();
        });
    }
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS & UI Logic
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
