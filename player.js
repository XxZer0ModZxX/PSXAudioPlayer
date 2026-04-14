const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// Change this name if you test Track01.wav, Track01.m4a, etc.
const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    // Basic interaction to tell the browser we're active
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Set source and FORCE MUTED (The handshake that worked for you)
    audioEngine.muted = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // Attempt silent playback immediately
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Playing Silently...");
    }).catch(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    });
};

// 3. PLAY BUTTON (The Unmute Kick)
btnPlay.onclick = function() {
    // Force volume settings
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(function() {
            // SUCCESS STATE - TURN GREEN
            btnLoadSong.style.backgroundColor = "green";
            // Nudge to force audio routing
            audioEngine.volume = 0.99;
            setTimeout(() => { audioEngine.volume = 1.0; }, 100);
        }).catch(function() {
            // FALLBACK logic that turned green for you before
            audioEngine.muted = true;
            audioEngine.play();
            setTimeout(function() {
                audioEngine.muted = false;
                btnLoadSong.style.backgroundColor = "green";
            }, 100);
        });
    }
};

btnPlay.onclick = function() {
    // 1. Refresh the source (Forces PS5 to re-examine the file)
    const currentSrc = audioEngine.src;
    audioEngine.src = currentSrc; 
    
    // 2. Hard-set volume and unmute
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    // 3. The Play Command
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "green";
        
        // 4. THE TRICK: Quickly toggle volume to 'jumpstart' the PS5 mixer
        setTimeout(() => {
            audioEngine.volume = 0.5;
            setTimeout(() => { audioEngine.volume = 1.0; }, 50);
        }, 100);
        
    }).catch(function() {
        // Fallback for strict mode
        audioEngine.muted = true;
        audioEngine.play().then(function() {
            audioEngine.muted = false;
            btnLoadSong.style.backgroundColor = "green";
        });
    });
};

// BIOS & UI Toggle Logic
document.getElementById('btn-open-bios').onclick = function() {
    fetch('./bios/SCPH7501.BIN').then(function(res) {
        return res.arrayBuffer();
    }).then(function(buf) {
        if (typeof startPS1Bios === "function") startPS1Bios(buf);
    });
};

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
