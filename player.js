const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON - The most important click
startOverlay.addEventListener('click', function() {
    // Force the audio engine to "prime" itself
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().then(function() {
        console.log("Audio Unlocked");
        startOverlay.style.display = 'none';
    }).catch(function() {
        // Even if it fails, hide overlay so we can try the Load button
        startOverlay.style.display = 'none';
    });
}, { once: true });

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Set the real track
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // PS5 needs a significant wait time to "trust" the file change
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1500);
};

// 3. THE PLAY BUTTON - The "Triple Attempt"
btnPlay.onclick = function() {
    // Method A: Standard Play
    audioEngine.muted = false;
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "green";
    }).catch(function() {
        // Method B: The "Mute Flip" (Tricks the browser into thinking it's an ad)
        audioEngine.muted = true;
        audioEngine.play().then(function() {
            audioEngine.muted = false;
            btnLoadSong.style.backgroundColor = "green";
        });
    });
};

btnStop.onclick = function() {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

// ... UI toggles and BIOS fetch remain the same ...
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};
