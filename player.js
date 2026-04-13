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
    audioEngine.play().catch(() => {}); 
    startOverlay.style.display = 'none';
};

/**
 * ABSOLUTE PATH PLAYBACK
 */
function playTrack(trackName) {
    // CHANGE 'YOURUSERNAME' TO YOUR ACTUAL GITHUB NAME BELOW
    const username = "YOURUSERNAME"; 
    const repo = "PSXAudioPlayer";
    const musicUrl = "https://" + username + ".github.io/" + repo + "/music/" + trackName;
    
    alert("Target URL: " + musicUrl);

    audioEngine.pause();
    audioEngine.src = musicUrl;
    audioEngine.load(); 

    // We wait a split second for the browser to "catch" the file
    setTimeout(() => {
        audioEngine.play()
            .then(() => { alert("Success! Playing now."); })
            .catch(error => {
                alert("File loaded but blocked. Press the pink PLAY button now.");
            });
    }, 500);
}

// Button Assignments
btnLoadSong.onclick = () => {
    // Double check: Is it Track01.mp3 or track1.mp3 on your GitHub?
    playTrack('Track01.mp3'); 
};

btnPlay.onclick = () => {
    if (audioEngine.src && audioEngine.src !== "") {
        audioEngine.play().catch(e => alert("System still blocking audio. Tap center of screen."));
    } else {
        alert("Audio Engine is empty. Click 'Load Music' again.");
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
