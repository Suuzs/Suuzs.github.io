document.addEventListener('DOMContentLoaded', () => {
    const startPrompt = document.getElementById('start-prompt');
    const promptText = document.getElementById('prompt-text');
    const container = document.querySelector('.container');
    const treeContainer = document.querySelector('.tree-container');
    const animatedText = document.getElementById('animated-text');
    
    const initialText = "Haz clic en el corazón";
    const mainText = "Para mi reyna.\nLamento no tener dinero en estos momentos para darte un detalle más agradable sin embargo, espero que este pequeño gesto te pueda transmitir todo el amor que siento por ti. Eres la persona más importante en mi vida y estoy orgulloso de ti en todo lo que haces te amo con todo mi corazón.\n\nFeliz 14 de Febrero.";

    let treeHearts = [];
    let branchHearts = [];
    let originalTreeSize = { width: 0, height: 0 };

    let i = 0;
    function typeInitialText() {
        if (i < initialText.length) {
            promptText.textContent += initialText.charAt(i);
            i++;
            setTimeout(typeInitialText, 100);
        }
    }
    typeInitialText();

    startPrompt.addEventListener('click', () => {
        startPrompt.style.transition = 'opacity 1s';
        startPrompt.style.opacity = '0';
        setTimeout(() => {
            startPrompt.style.display = 'none';
            container.style.display = 'flex';
            setTimeout(() => container.style.opacity = '1', 50);
            startMainAnimation();
        }, 1000);
    }, { once: true });

    function startMainAnimation() {
        animatedText.style.opacity = '1';
        typeWriter();

        setTimeout(() => {
            populateTreeWithHearts();
            addHeartsToBranches();
            setTimeout(() => {
                setInterval(createFallingHeart, 350);
            }, 1200);
        }, 1200);
    }

    function updateHeartsPosition() {
        const treeRect = document.getElementById('tree-svg').getBoundingClientRect();
        const treeCenterX = treeRect.left + treeRect.width / 2;
        const treeTopY = treeRect.top + treeRect.height * -0.1;

        treeHearts.forEach(heartData => {
            const x = treeCenterX + (heartData.offsetX * treeRect.width / originalTreeSize.width);
            const y = treeTopY + (heartData.offsetY * treeRect.height / originalTreeSize.height);
            heartData.element.style.left = `${x}px`;
            heartData.element.style.top = `${y}px`;
        });

        const scaleX = treeRect.width / originalTreeSize.width;
        const scaleY = treeRect.height / originalTreeSize.height;

        const branches = document.querySelectorAll('#tree-svg .branch');
        branchHearts.forEach(heartData => {
            const branch = branches[heartData.branchIndex];
            const point = branch.getPointAtLength(heartData.lengthRatio * branch.getTotalLength());
            const scaledOffsetX = heartData.offsetX * scaleX;
            const scaledOffsetY = heartData.offsetY * scaleY;
            heartData.element.style.left = `${treeRect.left + point.x + scaledOffsetX}px`;
            heartData.element.style.top = `${treeRect.top + point.y + scaledOffsetY}px`;
        });
    }

    window.addEventListener('resize', updateHeartsPosition);

    function populateTreeWithHearts() {
        const numHearts = 550; 
        const treeRect = document.getElementById('tree-svg').getBoundingClientRect();
        const treeCenterX = treeRect.left + treeRect.width / 2;
        const treeTopY = treeRect.top + treeRect.height * -0.1;

        originalTreeSize = { width: treeRect.width, height: treeRect.height }; 

        for (let i = 0; i < numHearts; i++) {
            const t = Math.random() * 2 * Math.PI;
            const randomFactor = Math.pow(Math.random(), 0.6); 
            const r = 180 * randomFactor;

            const offsetX = r * 1.2 * Math.sin(t) * Math.sin(t) * Math.sin(t);
            const offsetY = -r * (1.0 * Math.cos(t) - 0.4 * Math.cos(2*t) - 0.2 * Math.cos(3*t) - 0.1 * Math.cos(4*t));

            const heart = createHeartElement();
            heart.style.position = 'fixed';
            heart.style.left = `${treeCenterX + offsetX}px`;
            heart.style.top = `${treeTopY + offsetY}px`;
            heart.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
            heart.style.transition = `transform ${0.5 + Math.random()}s ease-out, opacity 0.5s`;
            
            const colors = ['#e53935', '#d81b60', '#ff8a80', '#ffcdd2', '#c2185b'];
            heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            document.body.appendChild(heart);

            treeHearts.push({
                element: heart,
                offsetX: offsetX,
                offsetY: offsetY
            });

            setTimeout(() => {
                heart.style.opacity = 1;
                heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.6})`;
            }, Math.random() * 1500);
        }
    }

    function addHeartsToBranches() {
        const branches = document.querySelectorAll('#tree-svg .branch');
        branches.forEach((branch, index) => {
            if (index === 0) return;
            
            const totalLength = branch.getTotalLength();
            const numClusters = 14;

            for (let i = 9; i < numClusters; i++) {
                const lengthRatio = i / numClusters;
                const point = branch.getPointAtLength(totalLength * lengthRatio);
                
                for (let j = 0; j < 20; j++) {
                    const heart = createHeartElement();
                    const treeRect = document.getElementById('tree-svg').getBoundingClientRect();
                    
                    const offsetX = (Math.random() - 2.5) * 30;
                    const offsetY = (Math.random() - 2.5) * 30;

                    heart.style.position = 'fixed';
                    heart.style.left = `${treeRect.left + point.x + offsetX}px`;
                    heart.style.top = `${treeRect.top + point.y + offsetY}px`;
                    heart.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
                    heart.style.transition = `transform 0.8s ease-out, opacity 0.8s`;
                    
                    const colors = ['#e53935', '#d81b60', '#ff8a80', '#ffcdd2', '#c2185b'];
                    heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    document.body.appendChild(heart);

                    branchHearts.push({
                        element: heart,
                        branchIndex: index,
                        lengthRatio: lengthRatio,
                        offsetX: offsetX,
                        offsetY: offsetY
                    });

                    setTimeout(() => {
                        heart.style.opacity = 1;
                        heart.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.4})`;
                    }, 500 + Math.random() * 1000);
                }
            }
        });
    }

    function createHeartElement() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        return heart;
    }

    function createFallingHeart() {
        const heart = createHeartElement();
        const colors = ['#e53935', '#d81b60', '#ff8a80', '#ffcdd2'];
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = `${Math.random() * 45}%`; 
        heart.style.animation = `fall ${4 + Math.random() * 4}s linear`;
        heart.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(heart);

        heart.addEventListener('animationend', () => {
            heart.remove();
            if (!animatedText.style.opacity || animatedText.style.opacity === '0') {
                animatedText.style.opacity = '1';
                typeWriter();
            }
        });
    }

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < mainText.length) {
            animatedText.textContent += mainText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }
});
