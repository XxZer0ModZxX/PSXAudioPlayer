const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

// 1. Initial Unlock
startOverlay.onclick = () => {
    // Prime the engine with a tiny bit of silence or low-level data
    audioEngine.play().catch(() => {}); 
    audioEngine.pause();
    startOverlay.classList.add('hidden');
    console.log("Audio Context Started");
};

/**
 * DIRECT PLAYBACK LOGIC
 */
function playTrack(trackName) {
    const musicPath = `./music/${trackName}`;
    
    // Setting src and play() in the same tick as the button click
    audioEngine.src = musicPath;
    audioEngine.load(); // Force the browser to start loading
    
    const playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Playback success");
            if (typeof syncAudioToEmulator === "function") {
                syncAudioToEmulator(audioEngine);
            }
        }).catch(error => {
            console.log("Playback failed. User must click Play again.");
            // If it fails, the user now has to click the 'Play' hitbox
        });
    }
}

// Button Assignments
btnLoadSong.onclick = () => playTrack('Track01.mp3');

btnPlay.onclick = () => {
    audioEngine.play().catch(e => console.log("Still blocked"));
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

btnNext.onclick = () => playTrack('Track01.mp3');

/**
 * BIOS LOGIC
 */
async function loadBiosFromGitHub() {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        if (!response.ok) throw new Error();
        const biosBuffer = await response.arrayBuffer();
        await startPS1Bios(biosBuffer);
    } catch (err) {
        console.log("BIOS load failed");
    }
}

btnOpenBios.onclick = () => loadBiosFromGitHub();

// Visualizer Toggles
document.getElementById('btn-viz-toggle').onclick = () => {
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
    if (typeof resizeCanvas === "function") resizeCanvas();
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};
