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
    // This creates a user-interaction bridge
    audioEngine.play().catch(() => {}); 
    startOverlay.style.display = 'none';
};

/**
 * UPDATED PLAYBACK LOGIC
 */
function playTrack(trackName) {
    const musicPath = "./music/" + trackName;
    
    // Reset and Load
    audioEngine.pause();
    audioEngine.src = musicPath;
    audioEngine.load(); // PS5 requires explicit load() sometimes
    
    alert("Attempting to play: " + trackName);

    // Try to play immediately
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("Playing!");
        }).catch(error => {
            // If it fails, the user MUST click the 'Play' hitbox
            alert("Loaded! Now click the pink PLAY button on the left to start sound.");
        });
    }
}

// Button Assignments
btnLoadSong.onclick = () => {
    playTrack('Track01.mp3'); 
};

btnPlay.onclick = () => {
    if (audioEngine.src) {
        audioEngine.play().catch(e => alert("Blocked! Tap screen again."));
    } else {
        alert("Click the Load button (bottom right) first!");
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
