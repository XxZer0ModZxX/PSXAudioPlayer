const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const btnNext = document.getElementById('btn-next');
const btnFF = document.getElementById('btn-ff');
const btnRW = document.getElementById('btn-rw');
const btnPrev = document.getElementById('btn-prev');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

// File is in the root folder
const TRACK_FILE = "Track01.mp3"; 
let isLoaded = false;

/**
 * 1. THE POWER ON HANDSHAKE
 */
startOverlay.onclick = () => {
    // We play a silent buffer to tell the PS5 hardware we are using the speakers
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. THE LOAD FUNCTION
 */
btnLoadSong.onclick = async () => {
    // If it's already yellow, clicking it again acts as a Play button
    if (isLoaded) {
        forcePlay();
        return;
    }

    btnLoadSong.style.backgroundColor = "white"; 
    
    try {
        // Use a timestamp to prevent the PS5 from using an old cached version
        const antiCacheUrl = TRACK_FILE + "?v=" + Date.now();
        audioEngine.src = antiCacheUrl;
        audioEngine.load();
        
        // Auto-Play attempt
        audioEngine.play().then(() => {
            btnLoadSong.style.backgroundColor = "green";
            isLoaded = true;
        }).catch(() => {
            // This is where the PS5 usually ends up (Yellow)
            btnLoadSong.style.backgroundColor = "yellow";
            isLoaded = true;
        });

    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
    }
};

/**
 * 3. THE FORCE PLAY LOGIC
 */
function forcePlay() {
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    audioEngine.play().then(() => {
        btnLoadSong.style.backgroundColor = "green";
    }).catch(err => {
        console.log("Still blocked");
    });
}

// Play button specific action
btnPlay.onclick = () => forcePlay();

// Other Controls
btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    if(isLoaded) btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = () => {
    audioEngine.pause();
    if(isLoaded) btnLoadSong.style.backgroundColor = "yellow";
};

/**
 * EXTRA BUTTONS
 */
btnNext.onclick = () => { btnLoadSong.click(); };
btnPrev.onclick = () => { btnLoadSong.click(); };
btnFF.onclick = () => { audioEngine.currentTime += 10; };
btnRW.onclick = () => { audioEngine.currentTime -= 10; };

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
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};
