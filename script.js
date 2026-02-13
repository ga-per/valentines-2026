let currentLevel = 0;
const targetDate = new Date('2026-02-13T01:30:00-03:00');

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('countdownScreen').classList.add('hidden');
        document.getElementById('mainHeader').style.display = 'block';
        document.getElementById('startScreen').classList.remove('hidden');
        return;
    }
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('timerDisplay').textContent = 
        `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    setTimeout(updateCountdown, 1000);
}

updateCountdown();

function startCaptcha() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('levelIndicator').style.display = 'block';
    currentLevel = 1;
    document.getElementById('currentLevel').textContent = 1;
    document.getElementById('level1').classList.remove('hidden');
    initLevel1();
}

// ====
// L1 - Selecione a foto
// ====
const coupleImages = [
    'couple-1.png', 'couple-2.png', 'couple-3.png',
    'couple-4.png', 'couple-5.png', 'couple-6.png',
    'couple-7.png', 'couple-8.png', 'couple-9.png'
];
let selectedImages = new Set();

function initLevel1() {
    const grid = document.getElementById('imageGrid');
    grid.innerHTML = '';
    selectedImages.clear();
    
    for (let i = 0; i < 9; i++) {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.style.backgroundImage = `url('images/${coupleImages[i]}')`;
        item.dataset.index = i;
        item.onclick = () => toggleImage(i);
        grid.appendChild(item);
    }
}

function toggleImage(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    if (selectedImages.has(index)) {
        selectedImages.delete(index);
        item.classList.remove('selected');
    } else {
        selectedImages.add(index);
        item.classList.add('selected');
    }
}

function verifyLevel1() {
    const isCorrect = selectedImages.size === 9;
    
    if (isCorrect) {
        goToLevel(2);
    } else {
        showMessage('Ele ta feliz em mais fotos! (Dica: ele sempre está feliz ao lado da garota que ele ama)');
    }
}

// ====
// L2 - Arraste pra perto
// ====
let correctTarget = 0;

function initLevel2() {
    correctTarget = 150;
    const slider = document.getElementById('slider');
    const movingImg = document.getElementById('movingImage');
    const targetImg = document.getElementById('targetImage');
    
    slider.value = 0;
    movingImg.style.left = '-150px';
    movingImg.src = 'images/gabriel-default.webp';
    targetImg.src = 'images/giovana-default.webp';
    
    slider.oninput = function() {
        const offset = this.value - 150;
        movingImg.style.left = offset + 'px';
        
        if (Math.abs(this.value - correctTarget) <= 5) {
            targetImg.src = 'images/giovana-happy.webp';
        } else {
            targetImg.src = 'images/giovana-default.webp';
        }
    };
}

function verifyLevel2() {
    const sliderValue = parseInt(document.getElementById('slider').value);
    const tolerance = 5;
    const targetImg = document.getElementById('targetImage');
    const movingImg = document.getElementById('movingImage');

    if (Math.abs(sliderValue - correctTarget) <= tolerance) {
        goToLevel(3);
    } else {
        showMessage('Mais perto, tá muito longe ainda!!');
        targetImg.src = 'images/giovana-sad.webp';
        movingImg.src = 'images/gabriel-sad.webp';

        setTimeout(() => {
            targetImg.src = 'images/giovana-default.webp';
            movingImg.src = 'images/gabriel-default.webp';
        }, 2000);
    }
}

// ====
// L3 - Pergunta diálogo
// ====
const dialog = [
    { speaker: 'Gabriel', text: '"Eu te amo muito!"' },
    { speaker: 'Giovana', text: '"Eu te amo mais"' },
    { speaker: 'Gabriel', text: '________' }
];
const correctAnswers = ['mais nao', 'mais não'];

function initLevel3() {
    const dialogBox = document.getElementById('dialogBox');
    dialogBox.innerHTML = '';
    
    dialog.forEach(line => {
        const p = document.createElement('p');
        p.className = 'dialog-line';
        p.innerHTML = `<strong>${line.speaker}:</strong> ${line.text}`;
        dialogBox.appendChild(p);
    });
    
    document.getElementById('answerInput').value = '';
}

function verifyLevel3() {
    const answer = document.getElementById('answerInput').value.toLowerCase().trim();

    if (correctAnswers.includes(answer)) {
        goToLevel(4);
    } else {
        showMessage('Errooou');
    }
}

// ====
// L4 - Estourar cravos hehe
// ====
let blackheads = [];
let bossBlackhead = null;
let bossBlackheadHasBeenPopped = false;
let bossClicks = 0;

function initLevel4() {
    const container = document.getElementById('blackheadsContainer');
    container.innerHTML = '';
    blackheads = [];
    bossBlackhead = null;
    bossClicks = 0;

    const numBlackheads = 6;

    for (let i = 0; i < numBlackheads; i++) {
        const blackhead = document.createElement('img');
        blackhead.src = 'images/valentines-blackhead.png';
        blackhead.className = 'blackhead';

        const verticalPos = 30 + Math.random() * 50;
        const normalizedPos = (verticalPos - 30) / 50;
        const topWidth = 100;
        const bottomWidth = 50;
        const widthAtPos = topWidth - normalizedPos * (topWidth - bottomWidth);
        const horizontalMin = (100 - widthAtPos) / 2;
        const horizontalPos = horizontalMin + Math.random() * widthAtPos;

        blackhead.style.top = verticalPos + '%';
        blackhead.style.left = horizontalPos + '%';
        blackhead.dataset.id = i;

        blackhead.onclick = function() {
            popBlackhead(this);
        };

        container.appendChild(blackhead);
        blackheads.push(blackhead);
    }
}

function popBlackhead(element) {
    element.classList.add('popped');
    setTimeout(() => {
        element.remove();
        blackheads = blackheads.filter(b => b !== element);
    }, 300);
}

function spawnBossBlackhead() {
    const container = document.getElementById('blackheadsContainer');
    bossBlackhead = document.createElement('img');
    bossBlackhead.src = 'images/valentines-blackhead.png';
    bossBlackhead.className = 'blackhead boss-blackhead';
    bossBlackhead.style.top = '50%';
    bossBlackhead.style.left = '50%';
    bossBlackhead.style.width = '60px';
    bossBlackhead.style.height = '60px';

    bossBlackhead.onclick = function() {
        bossClicks++;
        const newSize = 60 + (bossClicks * 30);
        bossBlackhead.style.width = newSize + 'px';
        bossBlackhead.style.height = newSize + 'px';

        if (bossClicks >= 5) {
            bossBlackhead.classList.add('popped');
            setTimeout(() => {
                bossBlackhead.remove();
                bossBlackhead = null;
                bossBlackheadHasBeenPopped = true;
            }, 300);
        }
    };

    container.appendChild(bossBlackhead);
}

function verifyLevel4() {
    const remaining = document.querySelectorAll('.blackhead:not(.popped)').length;

    if (remaining === 0 && bossBlackheadHasBeenPopped) {
        showSuccess();
    } else if (remaining === 0 && bossBlackhead === null) {
        showMessage('Peraa... tem mais um surgindo!');
        setTimeout(() => {
            spawnBossBlackhead();
            document.getElementById('message').textContent = '';
        }, 1000);
    } else if (bossBlackhead) {
        showMessage('Vaaai fica espremendo até ele sair!');
    } else {
        showMessage(`Ainda tem ${remaining} cravo${remaining > 1 ? 's' : ''} sobrando!`);
    }
}

// === General ===
function goToLevel(level) {
    document.getElementById(`level${currentLevel}`).classList.add('hidden');
    currentLevel = level;
    document.getElementById('currentLevel').textContent = level;
    document.getElementById(`level${level}`).classList.remove('hidden');
    document.getElementById('message').textContent = '';

    if (level === 2) initLevel2();
    if (level === 3) initLevel3();
    if (level === 4) initLevel4();
}

function showSuccess() {
    document.getElementById('message').classList.add('hidden');
    document.getElementById(`level${currentLevel}`).classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
    document.querySelector('.level-indicator').style.display = 'none';
}

function showMessage(msg) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = msg;
    messageEl.className = 'captcha-message error';
}

// Oi, gatinhaa! Se você leu até aqui, saiba que eu te amo muito!
