// Verification that the script is alive
alert("PSX Player Script: READY");

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
    // This simple line "wakes up" the PS5 audio context
    audioEngine.play().catch(() => {}); 
    startOverlay.style.display = 'none';
    console.log("Audio Context Started");
};

/**
 * DIRECT PLAYBACK LOGIC
 */
function playTrack(trackName) {
    // We use the full relative path
    const musicPath = "./music/" + trackName;
    
    // Set the source
    audioEngine.src = musicPath;
    
    // Force play immediately
    audioEngine.play()
        .then(() => {
            console.log("Success");
            // Only try to sync if the function exists to prevent crashing
            if (typeof syncAudioToEmulator === "function") {
                syncAudioToEmulator(audioEngine);
            }
        })
        .catch(error => {
            alert("PS5 Blocked Playback. Press the PLAY button on the left now.");
        });
}

// Button Assignments
btnLoadSong.onclick = () => {
    playTrack('Track01.mp3'); 
};

btnPlay.onclick = () => {
    audioEngine.play().catch(e => alert("Error: No song loaded or blocked."));
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

btnNext.onclick = () => {
    playTrack('Track01.mp3');
};

/**
 * BIOS LOGIC
 */
async function loadBiosFromGitHub() {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        if (!response.ok) throw new Error();
        const biosBuffer = await response.arrayBuffer();
        
        // Ensure the WASM function exists
        if (typeof startPS1Bios === "function") {
            await startPS1Bios(biosBuffer);
            alert("BIOS Running");
        } else {
            alert("Emulator Core not loaded yet.");
        }
    } catch (err) {
        alert("BIOS File not found in /bios/ folder.");
    }
}

btnOpenBios.onclick = () => loadBiosFromGitHub();

// Visualizer Toggles
document.getElementById('btn-viz-toggle').onclick = () => {
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};
