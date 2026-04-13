// Elements
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open'); // Map to the 'Load Music' hitbox
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
    } catch (err) {
        console.error("Critical Error loading BIOS:", err);
        alert("Failed to load BIOS. Check console/GitHub file case.");
    }
}

/**
 * FETCH MUSIC FROM GITHUB
 * PS5 blocks USB/Local selection, so we fetch from your repo.
 */
async function loadMusicFromGitHub(trackName) {
    const musicPath = `./music/${trackName}`; 
    console.log("Fetching Music: " + trackName);
    
    try {
        const response = await fetch(musicPath);
        if (!response.ok) throw new Error("Music file not found in /music/ folder.");

        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        
        audioEngine.src = fileURL;
        audioEngine.play();

        // Feed the audio to the emulator core for the visualizer
        if (typeof syncAudioToEmulator === "function") {
            syncAudioToEmulator(audioEngine);
        }
        
        console.log("Playing: " + trackName);
    } catch (err) {
        console.error("Error loading music:", err);
        alert("Music error: Ensure the file exists in your GitHub 'music' folder.");
    }
}

// Trigger Music Fetch on 'Load Music' button click
btnLoadSong.onclick = () => {
    // Change 'track1.mp3' to match your uploaded file name!
    loadMusicFromGitHub('track1.mp3'); 
};

// Trigger BIOS on 'Open' button click
btnOpenBios.onclick = () => {
    loadBiosFromGitHub();
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
