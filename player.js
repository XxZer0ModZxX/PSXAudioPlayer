const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const btnNext = document.getElementById('btn-next');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

// Assuming you moved Track01.mp3 to the same folder as index.html
const TRACK_FILE = "Track01.mp3"; 
let audioUnlocked = false;

// 1. Initial Unlock (Force hardware context)
startOverlay.onclick = () => {
    // Basic "wake up" for the browser
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD & AUTO-PLAY
 */
btnLoadSong.onclick = async () => {
    // If it's already yellow/loaded, try to force it to play again
    if (audioUnlocked && audioEngine.paused) {
        audioEngine.play();
        return;
    }

    // White indicates "loading"
    btnLoadSong.style.backgroundColor = "white"; 
    
    try {
        const antiCacheUrl = TRACK_FILE + "?v=" + Date.now();
        audioEngine.src = antiCacheUrl;
        audioEngine.load();
        
        // Immediate play attempt
        audioEngine.play().then(() => {
            btnLoadSong.style.backgroundColor = "green";
            audioUnlocked = true;
        }).catch(() => {
            // Yellow means "Loaded, but waiting for you to hit PLAY"
            btnLoadSong.style.backgroundColor = "yellow";
            audioUnlocked = true; 
        });

    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
    }
};

/**
 * 3. PLAY BUTTON (Secondary Manual Control)
 */
btnPlay.onclick = () => {
    // Direct playback call - MUST happen inside the click event
    audioEngine.play().then(() => {
        // Successful play
        if(audioUnlocked) btnLoadSong.style.backgroundColor = "green";
    }).catch(e => {
        // Fallback: If blocked, try to "unmute" and play again
        audioEngine.muted = false;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    if(audioUnlocked) btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = () => {
    audioEngine.pause();
    if(audioUnlocked) btnLoadSong.style.backgroundColor = "yellow";
};

btnNext.onclick = () => {
    // In this player, Next just reloads the song
    loadMusic();
};

/**
 * BIOS AND VIZ LOGIC (Keep previous versions if they worked)
 */
btnOpenBios.onclick = async () => {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        if (!response.ok) throw new Error("BIOS not found.");
        const biosBuffer = await response.arrayBuffer();
        await startPS1Bios(biosBuffer); 
        console.log("BIOS Running");
    } catch (err) {
        console.log("BIOS not found. Check /bios/ folder on GitHub.");
    }
};

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
