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

// Use your verified GitHub URL
const GITHUB_BASE = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/";

/**
 * 1. THE PS5 HANDSHAKE
 * Clicking the 'Power On' screen now pre-loads the audio engine
 */
startOverlay.onclick = () => {
    audioEngine.src = GITHUB_BASE + "Track01.mp3";
    audioEngine.load(); 
    
    // Attempt a silent play/pause to unlock the system
    audioEngine.play().then(() => {
        audioEngine.pause();
        startOverlay.style.display = 'none';
        console.log("PS5 Audio Unlocked");
    }).catch(() => {
        // If it blocks, we still hide overlay and wait for button click
        startOverlay.style.display = 'none';
    });
};

/**
 * 2. PLAYBACK LOGIC
 */
function playTrack(trackName) {
    const musicUrl = GITHUB_BASE + trackName;
    
    // Update source
    audioEngine.src = musicUrl;
    audioEngine.load();

    // The PS5 needs a moment to buffer the header
    setTimeout(() => {
        audioEngine.play()
            .then(() => { console.log("Success"); })
            .catch(error => {
                alert("File Ready! Now click the pink PLAY button on the player.");
            });
    }, 300);
}

// Button Assignments
btnLoadSong.onclick = () => {
    playTrack('Track01.mp3'); 
};

btnPlay.onclick = () => {
    if (audioEngine.src && audioEngine.src !== "") {
        audioEngine.play().catch(e => alert("Blocked! Tap the middle of the screen then Play again."));
    } else {
        alert("Audio Engine empty. Click 'Load Music' first.");
    }
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
        if (typeof startPS1Bios === "function") {
            await startPS1Bios(biosBuffer);
            alert("BIOS Running");
        }
    } catch (err) {
        alert("BIOS File Not Found");
    }
}

btnOpenBios.onclick = () => loadBiosFromGitHub();

// UI Toggles
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
