// Elements
const biosSelector = document.getElementById('bios-selector');
const btnOpenBios = document.getElementById('btn-open-bios');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const audioEngine = document.getElementById('audio-engine');

// Trigger hidden file input when clicking the PSX 'Open' button
btnOpenBios.onclick = () => biosSelector.click();

// BIOS Loading Logic
biosSelector.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const biosBuffer = event.target.result;
        console.log("BIOS Loaded. Starting Emulator Core...");
        
        try {
            // This function must exist within your wasmpsx.min.js
            await startPS1Bios(biosBuffer); 
            console.log("PS1 BIOS Running");
        } catch (err) {
            console.error("Failed to start emulator:", err);
            alert("Emulator Error: Check console/WASM compatibility.");
        }
    };
    reader.readAsArrayBuffer(file);
};

// Visualizer Toggle
document.getElementById('btn-viz-toggle').onclick = () => {
    mainUI.classList.add('hidden');
    vizOverlay.classList.remove('hidden');
    vizOverlay.classList.add('visible');
    // resizeCanvas(); // Define this if you have a specific resizing function
};

document.getElementById('btn-exit-viz').onclick = () => {
    vizOverlay.classList.remove('visible');
    vizOverlay.classList.add('hidden');
    mainUI.classList.remove('hidden');
};