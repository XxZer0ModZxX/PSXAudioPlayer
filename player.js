// Elements
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open'); // Map to the 'Load Disc' hitbox
const audioSelector = document.getElementById('audio-selector');
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
 * AUDIO LOADING LOGIC (USB/Local)
 */
btnLoadSong.onclick = () => {
    // Triggers the hidden <input type="file" id="audio-selector"> in your HTML
    audioSelector.click();
};

audioSelector.onchange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        console.log("Loading audio file:", file.name);

        // Create a URL for the selected file
        const fileURL = URL.createObjectURL(file);
        audioEngine.src = fileURL;
        audioEngine.play();

        // Feed the audio to the emulator core for the visualizer
        // This assumes 'wasmpsx' has a standard audio input hook
        if (typeof syncAudioToEmulator === "function") {
            syncAudioToEmulator(audioEngine);
        }
        
        alert("Song loaded: " + file.name);
    }
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
