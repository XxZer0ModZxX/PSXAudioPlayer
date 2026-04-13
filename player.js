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

// Unlock Audio and "Prime" the player
startOverlay.onclick = () => {
    // We play a silent 1-second burst to "force" the browser to allow audio
    audioEngine.src = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"; 
    audioEngine.play().then(() => {
        audioEngine.pause();
        startOverlay.classList.add('hidden');
        console.log("Audio Engine Authenticated");
    }).catch(err => {
        // If even this fails, we show the player anyway
        startOverlay.classList.add('hidden');
    });
};

/**
 * FETCH MUSIC FROM GITHUB
 */
async function loadMusicFromGitHub(trackName) {
    const musicPath = `./music/${trackName}`; 
    
    // 1. Immediate Action: Set the source and call play() right now
    // This is the "Direct" way consoles prefer
    audioEngine.src = musicPath;
    
    try {
        console.log("Requesting: " + musicPath);
        await audioEngine.play();
        alert("Playing: " + trackName);
        
        // Feed the audio to the emulator core for the visualizer
        if (typeof syncAudioToEmulator === "function") {
            syncAudioToEmulator(audioEngine);
        }
    } catch (err) {
        console.error("Playback failed:", err);
        alert("PS5 Blocked Audio. Try this: Press 'Play' after this message closes.");
    }
}

// Button Assignments
btnLoadSong.onclick = () => {
    loadMusicFromGitHub('Track01.mp3'); 
};

btnOpenBios.onclick = () => {
    loadBiosFromGitHub();
};

btnPlay.onclick = () => {
    audioEngine.play().catch(e => alert("Click the screen first!"));
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

btnNext.onclick = () => {
    loadMusicFromGitHub('Track01.mp3');
};

/**
 * BIOS LOGIC
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
        alert("BIOS Error: Ensure file is in /bios/ folder on GitHub.");
    }
}

// UI Toggles
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
