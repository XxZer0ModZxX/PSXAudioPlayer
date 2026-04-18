const audio = document.getElementById('audio-engine');
const fileSelector = document.getElementById('file-selector');
const minDisplay = document.getElementById('min-display');
const secDisplay = document.getElementById('sec-display');
const trackDisplay = document.getElementById('track-display');
const slotsContainer = document.getElementById('track-slots-container');
const mainUI = document.getElementById('main-ui');
const vizOverlay = document.getElementById('visualizer-overlay');
const canvas = document.getElementById('viz-canvas');
const ctx = canvas.getContext('2d');

let playlist = [];
let currentTrackIndex = 0;
let audioCtx, analyser, dataArray, source;
let isVisualizing = false;
let radarRotation = 0;
let spinAngle = 0;

// Smoothing arrays
let smoothedWidths = new Array(80).fill(0);
let stormSmooth = new Array(512).fill(0); 
let flareSmooth = new Array(1080).fill(0); 
let shardSmooth; 

// --- MODE: FUSION THUNDERBALL STATE ---
let ft_orbAmpSmooth = 0;
let ft_spokeSmooth = null;

// --- MODE 7: ELECTRIC SERPENT STATE ---
let serpentParticles = [];
let serpentPath = [];

// --- VIZ SWITCHING LOGIC ---
let vizMode = 7; 
setInterval(() => {
    vizMode = (vizMode + 1) % 9; // Updated to cycle through 9 modes
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // RESET STATES
    serpentPath = [];
    serpentParticles = [];
    ft_spokeSmooth = null;
}, 5000);

const trackCoords = [
    {x: 1145, y: 285}, {x: 1253, y: 285}, {x: 1361, y: 285}, {x: 1469, y: 285}, {x: 1577, y: 285},
    {x: 1145, y: 401}, {x: 1253, y: 401}, {x: 1361, y: 401}, {x: 1469, y: 401}, {x: 1577, y: 401},
    {x: 1145, y: 516}, {x: 1253, y: 516}, {x: 1361, y: 516}, {x: 1469, y: 516}, {x: 1577, y: 516},
    {x: 1145, y: 632}, {x: 1253, y: 632}, {x: 1361, y: 632}, {x: 1469, y: 632}, {x: 1577, y: 632}
];

function initSlots() {
    slotsContainer.innerHTML = '';
    trackCoords.forEach((coords, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'track-slot-wrapper';
        wrapper.id = `slot-${i}`;
        wrapper.style.left = `${coords.x}px`;
        wrapper.style.top = `${coords.y}px`;
        wrapper.style.display = 'none'; 
        const img = document.createElement('img');
        img.src = `Library/Track${i + 1}.png`;
        img.className = 'track-sphere-base';
        const num = document.createElement('span');
        num.className = 'track-slot-number';
        num.innerText = i + 1;
        wrapper.appendChild(img);
        wrapper.appendChild(num);
        slotsContainer.appendChild(wrapper);
    });
}
initSlots();

function initAudioContext() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.fftSize = 1024; 
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    resizeCanvas();
    draw();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = resizeCanvas;

function draw() {
    requestAnimationFrame(draw);
    if (!isVisualizing) return;
    analyser.getByteFrequencyData(dataArray);

    if (vizMode === 0) drawRadar(dataArray);
    else if (vizMode === 1) drawBumpingDisks(dataArray);
    else if (vizMode === 2) drawTheSpire(dataArray);
    else if (vizMode === 3) drawPulseTower(dataArray);
    else if (vizMode === 4) drawParticleStorm(dataArray); 
    else if (vizMode === 5) drawSolarFlare(dataArray);
    else if (vizMode === 6) drawPhasingShards(dataArray);
    else if (vizMode === 7) drawElectricSerpent(dataArray);
    else drawFusionThunderball(dataArray); 
}

/**
 * MODE: FUSION THUNDERBALL (FINAL POLISH - VOLUMETRIC CORE)
 * Fixes clipping by making the inner red/orange mass irregular and heavy.
 */
function drawFusionThunderball(data) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const cx = 0;
    const cy = 0;
    const baseRadius = 160; 
    const spikeCount = 220; 
    
    if (!ft_spokeSmooth) {
        ft_spokeSmooth = new Array(spikeCount).fill(baseRadius);
    }

    // Audio throb
    let sum = 0; for(let i = 0; i < data.length; i++) sum += data[i];
    const avgAmp = sum / data.length;
    ft_orbAmpSmooth += ((avgAmp / 255) - ft_orbAmpSmooth) * 0.1;

    // Pulse for the "breathing" orange heat
    const time = Date.now();
    const expansionPulse = Math.sin(time * 0.0015) * 0.5 + 0.5;

    // Phase 1: Keep your 'great' furry texture spikes
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < spikeCount; i++) {
        const theta = (i / spikeCount) * Math.PI * 2;
        const nextTheta = theta + (1.6 / spikeCount) * Math.PI * 2; 
        
        const audioIdx = Math.floor((i / spikeCount) * (data.length * 0.5));
        
        // --- ADDING TEXTURE JITTER ---
        const noise = Math.sin(i * 3.5) * 8;
        const targetRadius = baseRadius + (Math.pow(data[audioIdx] / 255, 1.4) * 190 * ft_orbAmpSmooth) + noise;
        
        ft_spokeSmooth[i] += (targetRadius - ft_spokeSmooth[i]) * 0.12;
        const currentRadius = ft_spokeSmooth[i];

        const rayGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentRadius);
        rayGrad.addColorStop(0, '#ff0000'); 
        
        // Dynamic heat breath
        const orangeStop = 0.35 + (expansionPulse * 0.4);
        rayGrad.addColorStop(orangeStop, `rgba(255, 60, 0, ${0.4 + expansionPulse * 0.6})`);

        rayGrad.addColorStop(0.8, 'rgba(255, 180, 0, 0.2)'); 
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalAlpha = 0.4 + (Math.sin(i * 1.5) * 0.4);
        ctx.fillStyle = rayGrad;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(Math.cos(theta) * currentRadius, Math.sin(theta) * currentRadius);
        ctx.lineTo(Math.cos(nextTheta) * currentRadius, Math.sin(nextTheta) * currentRadius);
        ctx.closePath();
        ctx.fill();
    }

    // --- PHASE 2: FIXED INNER THERMAL CORE ---
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    
    // 1. We replace the smooth circle with a turbulent, irregular shape
    // to match the messy, realistic plasma in Target.png.
    const corePoints = 60;
    ctx.beginPath();
    for(let j = 0; j <= corePoints; j++) {
        const angle = (j / corePoints) * Math.PI * 2;
        const coreNoise = Math.sin(angle * 5 + time * 0.003) * 10; // "Boiling" core noise
        const r = (baseRadius * 0.65) + coreNoise;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if(j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // 2. The core gradient needs a darker center for weight
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.7);
    coreGrad.addColorStop(0, '#660000');   // Deepest dark center
    coreGrad.addColorStop(0.4, '#b30000'); // Red Hot center
    coreGrad.addColorStop(0.8, '#ff4400'); // Vibrant Orange-Red edge
    coreGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');

    ctx.fillStyle = coreGrad;
    // We 'fill()' the turbulent shape we just defined, not a circle.
    ctx.fill();

    ctx.restore();
}

// --- MODE 7: ELECTRIC SERPENT (FIXED POSITIONING, RAIN, & COLOR) ---
function drawElectricSerpent(data) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const avgVolume = data.reduce((a, b) => a + b, 0) / data.length;
    const intensity = avgVolume / 255;
    const cy = canvas.height / 2;
    const cx = canvas.width / 2;
    const speed = 10 + (intensity * 15);

    // 1. POSITIONING (ENHANCED VERTICAL MOVEMENT)
    const time = Date.now() * 0.008; 
    
    // Increased base wave from 60 to 100, and ensured it always moves at least a little
    const waveOffset = Math.sin(time) * (40 + (60 * intensity)); 
    
    // Doubled the music-reactive jump (from 0.002 to 0.004)
    const targetY = (data[20] - 128) * (canvas.height * 0.004);
    
    if (typeof smoothSerpentY === 'undefined') smoothSerpentY = 0;
    
    const oldHeadY = (cy - 40) + smoothSerpentY + waveOffset;
    smoothSerpentY += (targetY - smoothSerpentY) * 0.1; 
    const headY = (cy - 40) + smoothSerpentY + waveOffset;
    const headX = cx - (canvas.width * 0.1); 
    const headVerticalShift = headY - oldHeadY;

    serpentPath.unshift({ x: headX, y: headY });
    if (serpentPath.length > 400) serpentPath.pop();

    // 2. PARTICLE & RAIN GENERATION
    if (intensity > 0.05 && serpentParticles.length < 1000) {
        for (let i = 0; i < 6; i++) {
            const isRed = Math.random() > 0.5; 
            serpentParticles.push({
                x: headX + 2, y: headY,
                vx: (Math.random() - 0.4) * 10 * intensity,
                vy: (Math.random() - 0.5) * 18 * intensity,
                life: 1.0,
                delay: 35,
                size: isRed ? Math.random() * 4 + 1 : Math.random() * 5 + 2,
                colorType: isRed ? 'red' : 'yellow',
                isRain: false
            });
        }

        for (let i = 0; i < 8; i++) {
            const rainColor = Math.random() > 0.5 ? 'red' : 'yellow';
            serpentParticles.push({
                x: canvas.width * (0.6 + Math.random() * 0.4), 
                y: -50, 
                vx: -(25 + Math.random() * 15), 
                vy: (20 + Math.random() * 10),  
                life: 1.5, 
                delay: 0, 
                size: Math.random() * 4 + 2,
                colorType: rainColor,
                isRain: true
            });
        }
    }

    ctx.globalCompositeOperation = 'screen';

    // 3. DRAW ALL PARTICLES
    ctx.shadowBlur = 0; 
    
    for (let i = serpentParticles.length - 1; i >= 0; i--) {
        let p = serpentParticles[i];
        
        if (p.delay > 0) {
            p.delay--;
            if (!p.isRain) { p.x = headX + 2; p.y = headY; }
            continue;
        }
        
        if (!p.isRain) {
            p.y += headVerticalShift; 
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.x -= speed * 0.4; 
        } else {
            p.vx *= 0.995;
            p.vy *= 0.995;
        }
        
        p.x += p.vx; 
        p.y += p.vy;
        p.life -= p.isRain ? 0.006 : 0.02; 
        
        if (p.life <= 0 || p.x < -50 || p.y > canvas.height + 50) { 
            serpentParticles.splice(i, 1); 
            continue; 
        }

        ctx.fillStyle = p.colorType === 'red' ? `rgba(255, 30, 0, ${p.life})` : `rgba(255, 230, 0, ${p.life})`;
        
        if (p.isRain) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.atan2(p.vy, p.vx));
            ctx.fillRect(0, 0, p.size * 3, p.size / 2);
            ctx.restore();
        } else {
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
    }

    // 4. DRAW SERPENT LINE
    ctx.beginPath();
    ctx.lineWidth = 3 + (intensity * 8);
    ctx.strokeStyle = 'white';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ff2200';
    
    for (let i = 0; i < serpentPath.length; i++) {
        let pt = serpentPath[i];
        pt.x -= speed;
        if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
        } else if (pt.x > -200) {
            const prevPt = serpentPath[i-1];
            const xc = (pt.x + prevPt.x) / 2;
            const yc = (pt.y + prevPt.y) / 2;
            ctx.quadraticCurveTo(prevPt.x, prevPt.y, xc, yc);
        }
    }
    ctx.stroke();

    // 5. RADIATING HEAT
    const heatGrad = ctx.createRadialGradient(headX, headY, 5, headX, headY, 300 * intensity);
    heatGrad.addColorStop(0, `rgba(255, 60, 0, ${0.4 * intensity})`);
    heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = heatGrad;
    ctx.shadowBlur = 0; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'source-over';
}

// --- MODE 6: PHASING SHARDS (GLOBAL BOUNDARY SAFETY) ---
function drawPhasingShards(data) {
    ctx.save(); 
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cy = canvas.height / 2;
    const cx = canvas.width / 2;
    const slideOffset = 20; 
    const baseFlare = 8; 
    const screenMargin = 15; // Global safety buffer for all tall peaks
    const maxHeight = cy - screenMargin;

    if (!shardSmooth) shardSmooth = {};

    // 1. Initial Background Shadow
    const shadowHeight = 60; 
    const shadowGrad = ctx.createLinearGradient(0, cy - shadowHeight, 0, cy + shadowHeight);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,1)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0)'); 
    shadowGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawSpikeGroup = (id, count, freq, color, ampMult, width, widthScale = 0.68, capped = false) => {
        if (!shardSmooth[id]) shardSmooth[id] = new Array(count).fill(0);
        ctx.fillStyle = color;
        const effectiveWidth = canvas.width * widthScale;
        const padding = (canvas.width - effectiveWidth) / 2; 
        const step = count > 1 ? effectiveWidth / (count - 1) : 0;
        const halfWidth = width / 2;
        const stagger = 10; 

        for (let i = 0; i < count; i++) {
            const rawAmp = data[freq + i] / 255; 
            shardSmooth[id][i] += (rawAmp - shardSmooth[id][i]) * 0.15;
            
            let amp = Math.pow(shardSmooth[id][i], 1.15) * cy * ampMult * 0.85; 
            if (capped) amp = Math.min(amp, maxHeight); // Apply boundary safety

            const xMid = padding + (i * step);
            ctx.globalAlpha = 0.92; 
            
            // TOP
            ctx.beginPath();
            ctx.moveTo(xMid + slideOffset - (halfWidth + baseFlare), cy + 2); 
            ctx.lineTo(xMid + slideOffset, cy - amp);       
            ctx.lineTo(xMid + slideOffset + (halfWidth + baseFlare), cy + 2);
            ctx.fill();
            
            // BOTTOM
            ctx.beginPath();
            ctx.moveTo(xMid - slideOffset + stagger - (halfWidth + baseFlare), cy - 2); 
            ctx.lineTo(xMid - slideOffset + stagger, cy + amp);       
            ctx.lineTo(xMid - slideOffset + stagger + (halfWidth + baseFlare), cy - 2);
            ctx.fill();
            
            ctx.globalAlpha = 1.0;
        }
    };

    ctx.globalCompositeOperation = 'screen'; 

    // --- 1. RED PEAKS (CAPPED) ---
    const rw = 110; const rh = rw / 2;
    if (!shardSmooth['red']) shardSmooth['red'] = new Array(4).fill(0);
    ctx.fillStyle = 'rgba(255, 0, 0, 0.85)';
    for(let i = 0; i < 4; i++) {
        const rawAmp = data[12 + i] / 255;
        shardSmooth['red'][i] += (rawAmp - shardSmooth['red'][i]) * 0.15;
        let amp = Math.min(Math.pow(shardSmooth['red'][i], 1.15) * cy * 1.8 * 0.75, maxHeight);

        if (i === 0) { let x = cx - (rw * 3.5) + slideOffset; ctx.beginPath(); ctx.moveTo(x-(rh+baseFlare), cy+2); ctx.lineTo(x, cy-amp); ctx.lineTo(x+(rh+baseFlare), cy+2); ctx.fill(); }
        if (i === 1) { let x = cx + rw + slideOffset; ctx.beginPath(); ctx.moveTo(x-(rh+baseFlare), cy+2); ctx.lineTo(x, cy-amp); ctx.lineTo(x+(rh+baseFlare), cy+2); ctx.fill(); }
        if (i === 2) { let x = cx - rw - slideOffset; ctx.beginPath(); ctx.moveTo(x-(rh+baseFlare), cy-2); ctx.lineTo(x, cy+amp); ctx.lineTo(x+(rh+baseFlare), cy-2); ctx.fill(); }
        if (i === 3) { let x = cx + (rw * 3.5) - slideOffset; ctx.beginPath(); ctx.moveTo(x-(rh+baseFlare), cy-2); ctx.lineTo(x, cy+amp); ctx.lineTo(x+(rh+baseFlare), cy-2); ctx.fill(); }
    }

    // --- 2. ORANGE ---
    drawSpikeGroup('orange', 2, 35, 'rgba(255, 100, 0, 0.75)', 1.1, 85, 0.4);

    // --- 3. PINE GREEN (Green/Blue) (NOW CAPPED) ---
    // Increased mult to 2.3 so it reaches the 'ceiling' more often
    drawSpikeGroup('pine-green', 13, 115, 'rgba(45, 182, 93, 0.85)', 2.3, 16, 0.5, true); 
    
    // --- 4. FLASHY GREEN (#58fa00) ---
    drawSpikeGroup('flashy-back', 14, 100, 'rgba(88, 250, 0, 0.85)', 1.8, 45, 0.52);

    // --- 5. YELLOW ---
    ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(255, 255, 0, 0.5)';
    drawSpikeGroup('yellow', 7, 70, 'rgba(255, 230, 0, 0.7)', 1.4, 75, 0.4); 
    ctx.shadowBlur = 0;

    // --- 6. DEEP GREEN (TOP LAYER) ---
    drawSpikeGroup('deep-green-top', 10, 90, 'rgba(0, 180, 40, 0.95)', 1.7, 35, 0.45);
    
    // --- FINAL BLACK HORIZON FADE ---
    ctx.globalCompositeOperation = 'source-over';
    const lineFadeHeight = 15; 
    const horizonGrad = ctx.createLinearGradient(0, cy - lineFadeHeight, 0, cy + lineFadeHeight);
    horizonGrad.addColorStop(0, 'rgba(0,0,0,0)');    
    horizonGrad.addColorStop(0.45, 'rgba(0,0,0,1)'); 
    horizonGrad.addColorStop(0.55, 'rgba(0,0,0,1)'); 
    horizonGrad.addColorStop(1, 'rgba(0,0,0,0)');    
    
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, cy - lineFadeHeight, canvas.width, lineFadeHeight * 2);

    ctx.restore();
}

function drawSolarFlare(data) {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2; const cy = canvas.height / 2; const rays = 450; 
    ctx.lineWidth = 1.8; ctx.lineCap = 'round';
    for (let i = 0; i < rays; i++) {
        const half = rays / 2; const mappedIdx = i < half ? i : rays - i;
        const samplePoint = Math.floor((mappedIdx / half) * (data.length * 0.6));
        const rawAmp = data[samplePoint] / 255;
        if (!flareSmooth[i]) flareSmooth[i] = 0;
        flareSmooth[i] += (rawAmp - flareSmooth[i]) * 0.2;
        const angle = (i / (rays - 1)) * Math.PI * 2;
        const maxRadius = Math.min(cx, cy) * 0.85; 
        const length = (flareSmooth[i] * maxRadius * (0.8 + Math.random() * 0.4)) + 20;
        const xEnd = cx + Math.cos(angle) * length; const yEnd = cy + Math.sin(angle) * length;
        const needleGrad = ctx.createLinearGradient(cx, cy, xEnd, yEnd);
        needleGrad.addColorStop(0, '#ff0000'); needleGrad.addColorStop(0.3, '#ff4500'); needleGrad.addColorStop(1, '#ffcc00');   
        ctx.strokeStyle = needleGrad; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(xEnd, yEnd); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 25; ctx.shadowColor = '#ff4500'; ctx.fill(); ctx.shadowBlur = 0; 
}

function drawParticleStorm(data) {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2; const cy = canvas.height / 2;
    const totalWidth = canvas.width * 0.7; const startX = cx - totalWidth / 2;
    const slices = 140; const step = totalWidth / slices;

    for (let i = 0; i < slices; i++) {
        const freqIdx = Math.floor((i / slices) * data.length * 0.6);
        const rawAmp = data[freqIdx] / 255;
        const pos = i / slices; // 0.0 to 1.0
        
        // --- NEW MULTI-PEAK ENVELOPE ---
        let envelope = 0;
        if (pos < 0.45) {
            // 1. Build up to mid-center (highest at 0.45)
            envelope = pos / 0.45;
        } else if (pos < 0.55) {
            // 2. Drop a few in height (the "dip" after center)
            envelope = 1.0 - ((pos - 0.45) / 0.1) * 0.3; // Drops to 0.7 height
        } else if (pos < 0.85) {
            // 3. Go up higher than the rest (highest peak at 0.85)
            envelope = 0.7 + ((pos - 0.55) / 0.3) * 0.6; // Rises from 0.7 to 1.3
        } else {
            // 4. Grow back low at the end
            envelope = 1.3 * (1 - (pos - 0.85) / 0.15);
        }

        stormSmooth[i] += (rawAmp - stormSmooth[i]) * 0.25;
        
        // Use a base multiplier of 400 so the "highest" peak (1.3) really pops
        const amp = stormSmooth[i] * envelope * 400;
        
        const x = startX + (i * step);
        const shardGrad = ctx.createLinearGradient(0, cy - amp, 0, cy + amp);
        
        // Gradient colors adjusted to track the new envelope
        const brightness = Math.floor(130 + (Math.min(envelope, 1.0) * 125));
        shardGrad.addColorStop(0, `rgba(180, 50, 0, 0.85)`);
        shardGrad.addColorStop(0.5, `rgba(255, ${brightness}, 0, 0.7)`);
        shardGrad.addColorStop(1, `rgba(180, 50, 0, 0.85)`);
        
        ctx.fillStyle = shardGrad; 
        ctx.beginPath(); 
        ctx.moveTo(x, cy - amp);  
        
        // Keep the "leaning" effect consistent with the shape
        const lean = -15 * Math.min(envelope, 1.0);
        ctx.lineTo(x + lean - 4, cy); 
        ctx.lineTo(x, cy + amp); 
        ctx.lineTo(x + 4, cy); 
        ctx.fill();
    }
}

function drawPulseTower(data) {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2; const towerHeight = canvas.height * 0.95;
    const startY = (canvas.height - towerHeight) / 2; const sliceCount = 80; 
    const sliceHeight = towerHeight / sliceCount;
    const leftPath = new Path2D(); const rightPath = new Path2D();
    
    for (let i = 0; i < sliceCount; i++) {
        const freqIndex = Math.floor((i / sliceCount) * data.length * 0.35);
        const baseAmp = Math.pow(data[freqIndex] / 255, 1.8);
        smoothedWidths[i] += (baseAmp - smoothedWidths[i]) * 0.3; 
        
        const rawLpw = 10 + (Math.pow(smoothedWidths[i], 1.2) * 190);
        
        // 1. Line Compression
        const lineCompression = i < 20 ? 0.5 + (i / 20) * 0.5 : 1.0;
        const lpw = rawLpw * lineCompression;
        
        const yPos = startY + (sliceCount - 1 - i) * sliceHeight;
        const color = `hsl(${220 + (i * 1.5)}, 100%, 50%)`;
        
        // 2. GLOW SOFTENER (With "Bottom Line" Exception)
        let glowSoftener = i < 10 ? 0.85 + (i / 10) * 0.15 : 1.0;
        
        // THE TWEAK: If it's the very bottom line (i=0), 
        // give it a little more length (0.92 instead of 0.85)
        if (i === 0) glowSoftener = 0.92;

        ctx.fillStyle = color; ctx.globalAlpha = 0.45;
        const outerW = lpw + (350 * glowSoftener); 
        ctx.fillRect(cx - outerW, yPos, outerW * 2, sliceHeight + 1);
        
        // 3. SOLID CORE
        ctx.globalAlpha = 1.0; 
        ctx.fillRect(cx - lpw, yPos, lpw * 2, sliceHeight + 1);
        
        if (i === 0) { 
            leftPath.moveTo(cx - lpw, yPos + sliceHeight); 
            rightPath.moveTo(cx + lpw, yPos + sliceHeight); 
        } else { 
            leftPath.lineTo(cx - lpw, yPos); 
            rightPath.lineTo(cx + lpw, yPos); 
        }
    }
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2.0; ctx.stroke(leftPath); ctx.stroke(rightPath);
}

function drawTheSpire(data) {
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 1. HORIZONTAL POSITIONING
    // 12% is a nice "in-between" for the left margin
    const startX = canvas.width * 0.12; 
    const cy = Math.floor(canvas.height / 2); 
    
    const bassLevel = data[20] / 255;
    // Set stretch back to 0.65 for a more controlled growth
    const globalStretch = 1.0 + (bassLevel * 0.65); 

    const configs = [
        {c:'red', f:20, w:160},         
        {c:'orange', f:50, w:60},       
        {c:'yellow', f:80, w:45},       
        {c:'chartreuse', f:110, w:35},   
        {c:'lime', f:140, w:140},       
        {c:'springgreen', f:180, w:240} 
    ];

    // 2. VERTICAL THICKNESS (Symmetry via LineWidth)
    const totalThickness = (canvas.height * 0.7) + (bassLevel * 60);

    let curX = startX;
    ctx.lineCap = 'butt'; 

    configs.forEach(cfg => {
        const pw = (cfg.w * (0.8 + (data[cfg.f]/255) * 0.4)) * globalStretch;
        
        const g = ctx.createLinearGradient(curX, 0, curX + pw, 0);
        g.addColorStop(0, 'black'); 
        g.addColorStop(0.5, cfg.c); 
        g.addColorStop(1, 'black');
        
        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth = totalThickness;
        
        const xStart = Math.floor(curX);
        const xEnd = Math.floor(curX + pw);
        
        ctx.moveTo(xStart, cy);
        ctx.lineTo(xEnd, cy);
        ctx.stroke();
        
        // Slightly wider gap (10px) to give the tubes some breathing room
        curX += pw + 10;
    });

    ctx.lineCap = 'round'; 
}

function drawBumpingDisks(data) {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2; 
    
    spinAngle += 0.02;

    const cfgs = [
        {c:'springgreen', f:15},  // Aqua
        {c:'lime', f:160},        
        {c:'chartreuse', f:45},   
        {c:'yellow', f:220},      
        {c:'orange', f:10},       
        {c:'red', f:85}           
    ];

    const radii = cfgs.map((c, i) => {
        let raw = data[c.f] / 255;
        
        // 1. SELECTIVE SENSITIVITY BOOST
        if (i === 0) {
            // Give Aqua Blue a specific boost so it bumps as hard as Red
            raw *= 1.8; 
        } else if (c.f > 60) {
            // Keep the boost for the high-frequency disks (Lime, Yellow, Red)
            raw *= 2.2; 
        }
        
        // 2. COMPACT & UNIFORM BUMP
        // Lowered the multiplier to 100 to keep everything on-screen
        const bump = Math.min(Math.pow(raw, 1.2) * 100, 110); 

        return 30 + bump; 
    });

    let total = 0; 
    radii.forEach(r => total += r * 2);

    ctx.save(); 
    ctx.translate(cx, cy); 
    ctx.rotate(spinAngle);

    let curX = -total / 2;

    cfgs.forEach((c, i) => {
        const r = radii[i]; 
        curX += r; 
        
        ctx.save(); 
        ctx.translate(curX, 0);
        
        const localSpin = (i % 2 === 0) ? -spinAngle * 3 : spinAngle * 2;
        const g = ctx.createConicGradient(localSpin, 0, 0);
        
        g.addColorStop(0, c.c); 
        g.addColorStop(0.5, 'rgba(0,0,0,0)'); 
        g.addColorStop(1, c.c);
        
        ctx.beginPath(); 
        ctx.arc(0, 0, r, 0, Math.PI * 2); 
        ctx.fillStyle = g; 
        ctx.fill(); 
        
        ctx.restore(); 
        curX += r;
    }); 
    
    ctx.restore();
}

function drawRadar(data) {
    const cx = Math.floor(canvas.width / 2);
    const cy = Math.floor(canvas.height / 2);
    
    ctx.fillStyle = 'rgba(0,0,0,0.15)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    radarRotation += 0.055;

    // 1. MAXIMUM PULSE LOGIC
    const bass = data[10] / 255;
    // Increased to 150 for a very aggressive bump
    const bump = bass * 150; 
    const baseRadius = 220; // Lowered slightly more to give room for the massive 150px bump
    const radius = baseRadius + bump;

    // 2. DARK RED DISK
    const g = ctx.createConicGradient(radarRotation - Math.PI * 1.5, cx, cy);
    g.addColorStop(0, 'rgba(0, 0, 0, 0)');        
    g.addColorStop(0.5, 'rgba(80, 0, 0, 0.4)');  
    g.addColorStop(1, 'rgba(130, 0, 0, 1)');      

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2); 
    ctx.fillStyle = g;
    ctx.fill();

    // 3. THE THICK ELECTRICAL LINE (Parallel & Distance-Synced)
    ctx.save();
    ctx.beginPath();
    const arcLength = Math.PI * 1.5; 
    const segments = 160;

    // Kept the 55 distance we liked, but it now pulses harder with the bass
    const baseLineDist = 55 + (bump * 0.3);

    for (let i = 0; i <= segments; i++) {
        const p = i / segments;
        const a = (radarRotation - Math.PI * 1.5 - 0.01) - (p * arcLength);
        
        // Jitter is now uniform across the whole line for perfect head/tail alignment
        const j = (data[Math.floor(p * 120)] / 255) * 15; 
        
        const x = cx + (baseLineDist + j) * Math.cos(a);
        const y = cy + (baseLineDist + j) * Math.sin(a);
        
        if (i === 0) ctx.moveTo(x, y); 
        else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'rgba(100, 0, 0, 0.8)'; 
    ctx.lineWidth = 18; 
    ctx.stroke();
    
    ctx.strokeStyle = 'white'; 
    ctx.lineWidth = 6;  
    ctx.stroke();
    ctx.restore();

    // 4. THE HUB (Now also pulsing harder)
    ctx.beginPath();
    ctx.arc(cx, cy, 45 + (bump * 0.15), 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
}

// --- PLAYER CONTROLS ---
document.getElementById('btn-viz-toggle').onclick = () => { initAudioContext(); isVisualizing = true; mainUI.classList.add('hidden'); vizOverlay.classList.add('visible'); };
function exitVisualizer() { isVisualizing = false; mainUI.classList.remove('hidden'); vizOverlay.classList.remove('visible'); }
vizOverlay.onclick = exitVisualizer;
window.addEventListener('mousemove', (e) => { if (Math.abs(e.movementX) > 15 || Math.abs(e.movementY) > 15) exitVisualizer(); });

document.getElementById('btn-play').onclick = () => { initAudioContext(); audio.play(); };
document.getElementById('btn-pause').onclick = () => audio.pause();
document.getElementById('btn-stop').onclick = () => { audio.pause(); audio.currentTime = 0; };
document.getElementById('btn-ff').onclick = () => audio.currentTime += 5;
document.getElementById('btn-rw').onclick = () => audio.currentTime -= 5;
document.getElementById('btn-next').onclick = () => playTrack(currentTrackIndex + 1);
document.getElementById('btn-prev').onclick = () => playTrack(currentTrackIndex - 1);
document.getElementById('btn-open').onclick = () => fileSelector.click();

fileSelector.onchange = (event) => {
    const files = Array.from(event.target.files).slice(0, 20);
    if (files.length > 0) {
        playlist = files.map(file => URL.createObjectURL(file));
        updateSlotVisibility();
        playTrack(0);
    }
};

function updateSlotVisibility() {
    for (let i = 0; i < 20; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            slot.style.display = i < playlist.length ? 'flex' : 'none';
            slot.classList.remove('active-track');
        }
    }
}

function playTrack(index) {
    if (index >= 0 && index < playlist.length) {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        currentTrackIndex = index;
        audio.src = playlist[index];
        audio.load(); 
        trackDisplay.innerText = index + 1;
        updateSlotVisibility();
        const activeSlot = document.getElementById(`slot-${index}`);
        if (activeSlot) activeSlot.classList.add('active-track');
        audio.play().catch(e => console.log("Playback blocked."));
    }
}

audio.ontimeupdate = () => {
    minDisplay.innerText = Math.floor(audio.currentTime / 60);
    let secs = Math.floor(audio.currentTime % 60);
    secDisplay.innerText = secs < 10 ? "0" + secs : secs;
};
