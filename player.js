const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// FIXED: Added the 'music/' folder to the path
const TRACK_FILE = "music/Track01.mp3"; 

// 1. POWER ON
startOverlay.onclick = function() {
    startOverlay.style.display = 'none';
    // Wake up audio
    audioEngine.play().catch(function(){});
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Reset and Load
    audioEngine.pause();
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // Wait for PS5 to buffer the file
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("File buffered from: " + TRACK_FILE);
    }, 1500);
};

// 3. PLAY BUTTON
btnPlay.onclick = function() {
    // Force the hardware to listen
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    audioEngine.play().then(function() {
        // TURN GREEN - This means the code is working!
        btnLoadSong.style.backgroundColor = "green";
    }).catch(function() {
        // Fallback for PS5 security
        audioEngine.muted = true;
        audioEngine.play().then(function() {
            audioEngine.muted = false;
        });
    });
};

btnStop.onclick = function() {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = function() {
    audioEngine.pause();
    btnLoadSong.style.backgroundColor = "yellow";
};

// UI Logic
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.remove('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
};
