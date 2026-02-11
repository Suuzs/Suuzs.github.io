document.addEventListener('DOMContentLoaded', () => {
    const promptText = document.getElementById('prompt-text');
    const animatedText = document.getElementById('animated-text');

    const initialText = "Haz clic en el corazón";
    const mainText = "Para mi reyna.\nLamento no tener dinero en estos momentos para darte un detalle más agradable sin embargo, espero que este pequeño gesto te pueda transmitir todo el amor que siento por ti. Eres la persona más importante en mi vida y estoy orgulloso de ti en todo lo que haces te amo con todo mi corazón.\n\nFeliz 14 de Febrero.";

    let i = 0;
    function typeInitialText() {
        if (i < initialText.length) {
            promptText.textContent += initialText.charAt(i);
            i++;
            setTimeout(typeInitialText, 100);
        }
    }
    typeInitialText();

    document.getElementById('start-prompt').addEventListener('click', () => {
        document.getElementById('start-prompt').style.transition = 'opacity 1s';
        document.getElementById('start-prompt').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('start-prompt').style.display = 'none';
            animatedText.style.opacity = '1';
            typeWriter();
        }, 1000);
    }, { once: true });

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < mainText.length) {
            animatedText.textContent += mainText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        regenerateTreeAndPetals();
    });

    let petals = [];
    let treeData = [];

    function createBranch(x, y, len, angle, width) {
        const baseCurve = (Math.random() - 0.5) * len * 0.3;
        const baseAngle = angle;
        const branch = {
            x, y, len, angle, width,
            baseCurve,
            curve: baseCurve,
            baseAngle,
            swayAngle: angle,
            children: [],
            isFlower: len < 15,
            flower: null,
            swaySeed: Math.random() * 1000
        };

        if (branch.isFlower) {
            branch.flower = {
                size: 3 + Math.random() * 4,
                color: ['#ffc8dd', '#ffb3c6', '#ff8fab', '#fb6f92'][Math.floor(Math.random() * 4)],
                baseRotation: Math.random() * 2 * Math.PI,
                swaySeed: Math.random() * 1000
            };
            return branch;
        }

        const newLen1 = len * (0.75 + Math.random() * 0.1);
        const newWidth1 = width * 0.7;
        const newAngle1 = -25 + (Math.random() * 15 - 7.5);
        branch.children.push(createBranch(0, -len, newLen1, newAngle1, newWidth1));

        if (Math.random() < 0.7) {
            const newLen2 = len * (0.5 + Math.random() * 0.2);
            const newWidth2 = width * 0.6;
            const newAngle2 = 20 + (Math.random() * 20 - 10);
            branch.children.push(createBranch(0, -len, newLen2, newAngle2, newWidth2));
        }

        if (len < 80 && Math.random() < 0.3) {
            const newLen3 = len * (0.3 + Math.random() * 0.1);
            const newWidth3 = width * 0.4;
            const angleSign = Math.random() < 0.5 ? 1 : -1;
            const newAngle3 = angleSign * (30 + Math.random() * 30);
            branch.children.push(createBranch(0, -len * (0.5 + Math.random() * 0.3), newLen3, newAngle3, newWidth3));
        }

        return branch;
    }

    function swayBranches(branch, time) {
        if (!branch.isFlower) {
            branch.curve = branch.baseCurve + Math.sin(time / 1500 + branch.swaySeed) * (branch.len * 0.18);
            branch.angle = branch.baseAngle + Math.sin(time / 2200 + branch.swaySeed) * 6;
            for (const child of branch.children) {
                swayBranches(child, time);
            }
        } else {
            branch.flower.rotation = branch.flower.baseRotation + Math.sin(time / 1200 + branch.flower.swaySeed) * 0.5;
        }
    }

    function drawFlowerStatic(x, y, flower) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(flower.rotation || 0);
        ctx.fillStyle = flower.color;
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * 2 * Math.PI;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(flower.size, 0, flower.size, flower.size / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, flower.size / 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }

    function drawBranch(branch) {
        ctx.save();
        ctx.translate(branch.x, branch.y);
        ctx.rotate(branch.angle * Math.PI / 180);
        ctx.strokeStyle = '#6D291E';
        ctx.lineWidth = branch.width;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(branch.curve, -branch.len / 2, 0, -branch.len);
        ctx.stroke();

        if (branch.isFlower) {
            drawFlowerStatic(0, -branch.len, branch.flower);
        } else {
            for (const child of branch.children) {
                drawBranch(child);
            }
        }
        ctx.restore();
    }

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.1;
            this.w = 10 + Math.random() * 5;
            this.h = 5 + Math.random() * 5;
            this.speed = 1 + Math.random() * 1;
            this.rotation = Math.random() * 2 * Math.PI;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.color = ['#ffc8dd', '#ffb3c6', '#ff8fab', '#fb6f92'][Math.floor(Math.random() * 4)];
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y / 50) * 0.5;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -this.h;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }

    function createPetals() {
        for (let i = 0; i < 50; i++) {
            petals.push(new Petal());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();
        swayBranches(treeData, now);
        drawBranch(treeData);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    function getTreeParams() {
        if (window.innerWidth <= 600) {
            return {
                x: canvas.width * 0.7,
                y: canvas.height,
                len: 80,
                angle: 0,
                width: 16
            };
        } else if (window.innerWidth <= 900) {
            return {
                x: canvas.width * 0.75,
                y: canvas.height,
                len: 110,
                angle: 0,
                width: 22
            };
        } else {
            return {
                x: canvas.width * 0.8,
                y: canvas.height,
                len: 150,
                angle: 0,
                width: 30
            };
        }
    }

    function regenerateTreeAndPetals() {
        const params = getTreeParams();
        treeData = createBranch(params.x, params.y, params.len, params.angle, params.width);
        petals = [];
        createPetals();
    }

    regenerateTreeAndPetals();
    animate();
});
