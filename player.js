const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

// The file MUST be in the root folder for this to work best
const TRACK_FILE = "Track01.mp3"; 
let audioEngine = document.getElementById('audio-engine');

/**
 * 1. THE POWER ON
 */
startOverlay.onclick = () => {
    startOverlay.style.display = 'none';
};

/**
 * 2. THE LOAD BUTTON
 * Just prepares the state and gives feedback.
 */
btnLoadSong.onclick = () => {
    btnLoadSong.style.backgroundColor = "yellow";
    console.log("Track Ready");
};

/**
 * 3. THE NUCLEAR PLAY BUTTON
 * We destroy the old audio and create a new one on every click
 */
btnPlay.onclick = () => {
    // 1. Remove the old engine if it exists
    if (audioEngine) {
        audioEngine.pause();
        audioEngine.src = "";
        audioEngine.load();
        audioEngine.remove();
    }

    // 2. Create a BRAND NEW audio element
    audioEngine = document.createElement('audio');
    audioEngine.id = "audio-engine";
    audioEngine.playsInline = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    document.body.appendChild(audioEngine);

    // 3. Immediate Play
    audioEngine.play().then(() => {
        btnLoadSong.style.backgroundColor = "green";
    }).catch(e => {
        // If it still fails, try one more "Muted" kickstart
        audioEngine.muted = true;
        audioEngine.play().then(() => {
            audioEngine.muted = false;
            btnLoadSong.style.backgroundColor = "green";
        });
    });
};

btnStop.onclick = () => {
    if (audioEngine) {
        audioEngine.pause();
        audioEngine.currentTime = 0;
    }
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = () => {
    if (audioEngine) audioEngine.pause();
    btnLoadSong.style.backgroundColor = "yellow";
};

/**
 * BIOS AND VIZ
 */
btnOpenBios.onclick = async () => {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        const biosBuffer = await response.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(biosBuffer);
    } catch (err) {}
};

document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.remove('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
};
