const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 

/**
 * 1. THE POWER ON & PRE-LOAD
 * We start the download IMMEDIATELY here.
 */
startOverlay.onclick = () => {
    // 1. Force hardware wake-up
    audioEngine.src = TRACK_FILE; 
    audioEngine.load(); 
    
    // 2. Start a silent play to "prime" the speakers
    audioEngine.play().then(() => {
        // If it plays immediately (rare), just pause it and wait
        audioEngine.pause();
    }).catch(() => {
        // This is expected on PS5
        console.log("Engine Primed");
    });

    startOverlay.style.display = 'none';
};

/**
 * 2. THE LOAD BUTTON (The "Unlocker")
 */
btnLoadSong.onclick = () => {
    // Visual feedback
    btnLoadSong.style.backgroundColor = "white";
    
    // Try to play the pre-loaded file
    audioEngine.play().then(() => {
        btnLoadSong.style.backgroundColor = "green";
    }).catch(() => {
        // If it still blocks, we stay yellow and wait for the Play button
        btnLoadSong.style.backgroundColor = "yellow";
    });
};

/**
 * 3. THE PLAY BUTTON (The "Hammer")
 * We use a loop here. It will try to play every 100ms 
 * for 1 second to catch the PS5 "trust window."
 */
btnPlay.onclick = () => {
    let attempts = 0;
    const interval = setInterval(() => {
        audioEngine.muted = false;
        audioEngine.volume = 1.0;
        
        audioEngine.play().then(() => {
            btnLoadSong.style.backgroundColor = "green";
            clearInterval(interval);
        }).catch(() => {
            attempts++;
            if (attempts > 10) clearInterval(interval);
        });
    }, 100);
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = () => {
    audioEngine.pause();
    btnLoadSong.style.backgroundColor = "yellow";
};

/**
 * BIOS AND UI
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
    document.getElementById('visualizer-overlay').style.display = 'flex';
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').style.display = 'none';
    document.getElementById('main-ui').classList.remove('hidden');
};
