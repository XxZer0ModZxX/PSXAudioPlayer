// Elements
const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

// NEW: Unlock Audio on First Click
startOverlay.onclick = () => {
    // This empty play/pause "wakes up" the browser audio engine
    audioEngine.play().then(() => {
        audioEngine.pause();
        audioEngine.currentTime = 0;
    }).catch(e => console.log("Wake up blocked, but context is opening."));
    
    startOverlay.classList.add('hidden');
    console.log("Audio Unlocked");
};

/**
 * AUTO-LOAD BIOS LOGIC
 */
async function loadBiosFromGitHub() {
    const biosPath = './bios/SCPH7501.BIN'; 
    try {
        const response = await fetch(biosPath);
        if (!response.ok) throw new Error("BIOS not found.");
        const biosBuffer = await response.arrayBuffer();
        await startPS1Bios(biosBuffer); 
        alert("BIOS Loaded!");
    } catch (err) {
        alert("BIOS Error: Check GitHub file names.");
    }
}

/**
 * FETCH MUSIC FROM GITHUB
 */
async function loadMusicFromGitHub(trackName) {
    const musicPath = `./music/${trackName}`; 
    alert("Loading: " + trackName);

    try {
        const response = await fetch(musicPath);
        if (!response.ok) {
            alert("Error 404: Check file name in /music/");
            return;
        }

        const blob = await response.blob();
        audioEngine.src = URL.createObjectURL(blob);
        
        audioEngine.play().then(() => {
            console.log("Playback started!");
        }).catch(e => {
            alert("Still blocked! Click the background first.");
        });

        if (typeof syncAudioToEmulator === "function") {
            syncAudioToEmulator(audioEngine);
        }
        
    } catch (err) {
        alert("Network Error: " + err.message);
    }
}

btnLoadSong.onclick = () => loadMusicFromGitHub('Track01.mp3');
btnOpenBios.onclick = () => loadBiosFromGitHub();

btnPlay.onclick = () => {
    if (audioEngine.src) audioEngine.play();
    else alert("Load music first!");
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

btnNext.onclick = () => loadMusicFromGitHub('Track01.mp3');

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
