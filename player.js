// Elements
const btnOpenBios = document.getElementById('btn-open-bios');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

/**
 * AUTO-LOAD BIOS LOGIC
 * This function fetches the BIOS from your GitHub folder 
 * instead of asking the PS5 to upload a local file.
 */
async function loadBiosFromGitHub() {
    // IMPORTANT: Ensure the filename and case match exactly in your GitHub repo
    const biosPath = './bios/SCPH7501.BIN'; 
    
    console.log("Fetching BIOS from GitHub...");
    
    try {
        const response = await fetch(biosPath);
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: BIOS not found.`);
        }

        const biosBuffer = await response.arrayBuffer();
        console.log("BIOS successfully downloaded into memory.");
        
        // Start the emulator core (provided by wasmpsx.min.js)
        console.log("Initializing Emulator Core...");
        await startPS1Bios(biosBuffer); 
        
        console.log("PS1 BIOS is now running!");
    } catch (err) {
        console.error("Critical Error loading BIOS:", err);
        alert("Failed to load BIOS. Make sure the file exists in /bios/SCPH7501.BIN on GitHub.");
    }
}

// Trigger the auto-load when clicking the PSX 'Open' button
btnOpenBios.onclick = () => {
    loadBiosFromGitHub();
};

// Visualizer Toggle Logic
document.getElementById('btn-viz-toggle').onclick = () => {
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
    
    // If your emulator core has a resize function, call it here
    if (typeof resizeCanvas === "function") {
        resizeCanvas();
    }
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};
