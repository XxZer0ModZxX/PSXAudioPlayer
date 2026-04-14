const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// Root file
const TRACK_FILE = "Track01.mp3";

startOverlay.onclick = () => {
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

btnLoadSong.onclick = async () => {
    // If it's already yellow/loaded, clicking it again will force a play
    if (audioEngine.src.includes(TRACK_FILE) && audioEngine.paused) {
        audioEngine.play();
        btnLoadSong.style.backgroundColor = "green";
        return;
    }

    btnLoadSong.style.backgroundColor = "white"; 
    
    try {
        const antiCacheUrl = TRACK_FILE + "?v=" + Date.now();
        audioEngine.src = antiCacheUrl;
        audioEngine.load();
        
        // We try to play every 500ms until it works
        const playAttempt = setInterval(() => {
            audioEngine.play().then(() => {
                btnLoadSong.style.backgroundColor = "green";
                clearInterval(playAttempt);
            }).catch(() => {
                btnLoadSong.style.backgroundColor = "yellow";
                // Keep trying until user interaction allows it
            });
        }, 500);

    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
    }
};

btnPlay.onclick = () => {
    // Aggressive play call
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    audioEngine.play();
};

btnStop.onclick = () => {
    audioEngine.pause();
};

// ... UI Logic stays same ...
