alert("PSX Player Script: READY");

const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// Use your verified GitHub URL
const GITHUB_BASE = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/";
let queuedTrack = "Track01.mp3"; // Default song

// 1. Initial Unlock
startOverlay.onclick = () => {
    // We play a silent moment to tell PS5 the audio channel is ours
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD MUSIC BUTTON
 * This just "prepares" the song name.
 */
btnLoadSong.onclick = () => {
    queuedTrack = "Track01.mp3"; 
    alert("Track Selected: " + queuedTrack + ". NOW PRESS THE PLAY BUTTON.");
};

/**
 * 3. THE PLAY BUTTON (The "Master" Button)
 * On PS5, the click AND the .src change AND the .play() MUST happen here.
 */
btnPlay.onclick = () => {
    const musicUrl = GITHUB_BASE + queuedTrack;
    
    // If the engine isn't already playing this specific song
    if (audioEngine.src !== musicUrl) {
        audioEngine.src = musicUrl;
        audioEngine.load();
    }

    // Force playback immediately on the click event
    audioEngine.play().then(() => {
        console.log("Success!");
    }).catch(e => {
        // If it fails, we try a secondary "hard" play
        setTimeout(() => { audioEngine.play(); }, 100);
        alert("If no sound, tap the middle of the screen then hit Play again.");
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// ... (Rest of your BIOS and Viz logic stays the same) ...
