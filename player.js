// Elements
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open'); // Map to the 'Load Music' hitbox
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnNext = document.getElementById('btn-next');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

/**
 * AUTO-LOAD BIOS LOGIC
 */
async function loadBiosFromGitHub() {
    const biosPath = './bios/SCPH7501.BIN'; 
    console.log("Fetching BIOS from GitHub...");
    
    try {
        const response = await fetch(biosPath);
        if (!response.ok) throw new Error(`Server responded with ${response.status}: BIOS not found.`);

        const biosBuffer = await response.arrayBuffer();
        console.log("BIOS downloaded. Initializing Emulator Core...");
        
        await startPS1Bios(biosBuffer); 
        console.log("PS1 BIOS is now running!");
        alert("BIOS Loaded Successfully!");
    } catch (err) {
        console.error("Critical Error loading BIOS:", err);
        alert("Failed to load BIOS. Ensure /bios/SCPH7501.BIN exists on GitHub.");
    }
}

/**
 * FETCH MUSIC FROM GITHUB
 * PS5 blocks USB/Local selection, so we fetch from your repo.
 */
async function loadMusicFromGitHub(trackName) {
    const musicPath = `./music/${trackName}`; 
    console.log("Attempting to fetch: " + musicPath);
    
    // Debug Alert 1
    alert("Loading: " + trackName);

    try {
        const response = await fetch(musicPath);
        
        if (!response.ok) {
            alert("Error 404: File not found on GitHub. Check case sensitivity!");
            return;
        }

        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        
        audioEngine.src = fileURL;
        
        // Console interaction requirement: try to play
        audioEngine.play().then(() => {
            alert("Playback started!");
        }).catch(e => {
            alert("Playback blocked. Click the screen once then try again.");
            console.error(e);
        });

        // Feed the audio to the emulator core for the visualizer
        if (typeof syncAudioToEmulator === "function") {
            syncAudioToEmulator(audioEngine);
        }
        
    } catch (err) {
        console.error("Error loading music:", err);
        alert("Network Error: " + err.message);
    }
}

// 1. Trigger Music Fetch on 'Load Music' button click
btnLoadSong.onclick = () => {
    loadMusicFromGitHub('Track01.mp3'); 
};

// 2. Trigger BIOS on 'Open' button click
btnOpenBios.onclick = () => {
    loadBiosFromGitHub();
};

// 3. Play Button Logic
btnPlay.onclick = () => {
    if (audioEngine.src) {
        audioEngine.play();
    } else {
        alert("No song loaded! Click the Load Music button first.");
    }
};

// 4. Stop Button Logic
btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// 5. Next Button Logic (For now, reloads the same track as a test)
btnNext.onclick = () => {
    loadMusicFromGitHub('Track01.mp3');
};

// Visualizer Toggle Logic
document.getElementById('btn-viz-toggle').onclick = () => {
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
    
    if (typeof resizeCanvas === "function") {
        resizeCanvas();
    }
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};
