document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    
    const aSlider = document.getElementById('a-slider');
    const pSlider = document.getElementById('p-slider');
    const qSlider = document.getElementById('q-slider');
    
    const aVal = document.getElementById('a-val');
    const pVal = document.getElementById('p-val');
    const qVal = document.getElementById('q-val');
    const eqnText = document.getElementById('eqn-text');

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 20; // 1 unit = 20 pixels

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Get values
        const a = parseFloat(aSlider.value);
        const p = parseFloat(pSlider.value);
        const q = parseFloat(qSlider.value);

        // Update UI
        aVal.textContent = a.toFixed(1);
        pVal.textContent = p.toFixed(1);
        qVal.textContent = q.toFixed(1);
        
        // Equation text logic
        let pPart = p === 0 ? "x" : `(x - ${p})`;
        if (p < 0) pPart = `(x + ${Math.abs(p)})`;
        eqnText.textContent = `y = ${a.toFixed(1)}${pPart}² + ${q.toFixed(1)}`;

        // Draw parabola
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;
        ctx.beginPath();

        let started = false;
        for (let screenX = 0; screenX <= width; screenX++) {
            // Convert screen X to math X
            const x = (screenX - centerX) / scale;
            
            // Calculate y = a(x - p)^2 + q
            const y = a * Math.pow(x - p, 2) + q;
            
            // Convert math Y to screen Y
            const screenY = centerY - (y * scale);

            if (screenY >= 0 && screenY <= height) {
                if (!started) {
                    ctx.moveTo(screenX, screenY);
                    started = true;
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            } else if (started) {
                // To keep the line continuous even if it goes off screen slightly
                ctx.lineTo(screenX, screenY);
            }
        }
        ctx.stroke();

        // Draw vertex point
        ctx.fillStyle = '#ff6b6b';
        const vertexSX = centerX + (p * scale);
        const vertexSY = centerY - (q * scale);
        ctx.beginPath();
        ctx.arc(vertexSX, vertexSY, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Initial draw
    draw();

    // Event listeners
    [aSlider, pSlider, qSlider].forEach(slider => {
        slider.addEventListener('input', draw);
    });

    // Calculator Logic
    const calcA = document.getElementById('calc-a');
    const calcB = document.getElementById('calc-b');
    const calcC = document.getElementById('calc-c');
    const calcBtn = document.getElementById('calc-btn');
    const calcResult = document.getElementById('calc-result');

    calcBtn.addEventListener('click', () => {
        const a = parseFloat(calcA.value);
        const b = parseFloat(calcB.value);
        const c = parseFloat(calcC.value);

        if (a === 0) {
            calcResult.textContent = 'a는 0이 될 수 없습니다 (이차함수가 아님).';
            return;
        }

        const p = -b / (2 * a);
        const q = (a * p * p) + (b * p) + c;

        calcResult.textContent = `꼭짓점: (${p.toFixed(2)}, ${q.toFixed(2)}) | 표준형: y = ${a}(x ${p >= 0 ? '-' : '+'} ${Math.abs(p).toFixed(2)})² ${q >= 0 ? '+' : '-'} ${Math.abs(q).toFixed(2)}`;
    });

    // Reveal Logic
    const revealBoxes = document.querySelectorAll('.reveal-box');
    revealBoxes.forEach(box => {
        box.addEventListener('click', function() {
            this.classList.add('active');
        });
    });
});
