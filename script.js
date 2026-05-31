const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const container = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const multiplierDisplay = document.getElementById('multiplier');
const livesDisplay = document.getElementById('lives');
const shieldDisplay = document.getElementById('shield-status');
const finalScoreDisplay = document.getElementById('final-score');

// gaME SETTINGS
let gameActive = false;
let score = 0;
let multiplier = 1.0;
let lives = 3;
let hasShield = false;
let shieldTimer = 0;

let player;
let bullets = [];
let enemies = [];
let items = [];
let particles = [];

// for tracking mouse physics and momentum
const mouse = { x: canvas.width / 2, y: canvas.height * 0.8 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// enemy generrator
function drawDoodleCircle(context, cx, cy, r, strokeColor, fillColor, lineWidth = 3) {
    context.save();
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.beginPath();
    
    // Add new wobally variables
    for (let i = 0; i < 360; i += 15) {
        let angle = (i * Math.PI) / 180;
        let wobble = Math.sin(i * 3) * 1.5; 
        let x = cx + (r + wobble) * Math.cos(angle);
        let y = cy + (r + wobble) * Math.sin(angle);
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    }
    
    context.closePath();
    if (fillColor) context.fill();
    context.stroke();
    context.restore();
}

// for drawing notebook line
function drawNotebookBackground() {
    ctx.fillStyle = '#fffdf6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e5edf7';
    ctx.lineWidth = 2;
    
    // blue horizontal line
    for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // notebook margine 
    ctx.strokeStyle = '#ffb3b3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(85, 0);
    ctx.lineTo(85, canvas.height);
    ctx.stroke();
}
class PlayerRocket {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height * 0.8;
        this.radius = 22;
        this.fireRate = 180;
        this.lastShot = 0;
    }

    update() {

        this.x += (mouse.x - this.x) * 0.18;
        this.y += (mouse.y - this.y) * 0.18;

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        const now = Date.now();
        if (now - this.lastShot > this.fireRate) {
            bullets.push(new CrayonBullet(this.x, this.y - this.radius));
            this.lastShot = now;
        }

        if (hasShield && Date.now() > shieldTimer) {
            hasShield = false;
            shieldDisplay.classList.add('hidden');
        }
    }

    draw() {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#4d4637';
        
        // Drawing boosters
        ctx.fillStyle = '#ff9f1c';
        ctx.beginPath();
        ctx.moveTo(this.x - 20, this.y + 10);
        ctx.lineTo(this.x - 30, this.y + 30);
        ctx.lineTo(this.x, this.y + 20);
        ctx.lineTo(this.x + 30, this.y + 30);
        ctx.lineTo(this.x + 20, this.y + 10);
        ctx.fill();
        ctx.stroke();

        // main body or user
        ctx.fillStyle = '#4cc9f0';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 30);
        ctx.lineTo(this.x - 22, this.y + 15);
        ctx.lineTo(this.x + 22, this.y + 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        
        drawDoodleCircle(ctx, this.x, this.y - 2, 7, '#4d4637', '#fff');

        // shield 
        if (hasShield) {
            drawDoodleCircle(ctx, this.x, this.y, this.radius + 20, '#3a86c8', 'rgba(58, 134, 200, 0.15)', 3);
        }
        ctx.restore();
    }
}

class CrayonBullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 10;
    }
    update() { this.y -= this.speed; }
    draw() {
        drawDoodleCircle(ctx, this.x, this.y, this.radius, '#4d4637', '#ff6b6b', 2);
    }
}

class InkMonster {
    constructor() {
        this.radius = Math.random() * 15 + 18;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = -this.radius;
        this.speed = Math.random() * 2 + 2 + (score / 7000);
        this.wiggleFactor = Math.random() * 3 + 1;
        this.seed = Math.random() * 100;
    }

    update() {
        this.y += this.speed;
        // for zigzak flowing lines
        this.x += Math.sin((Date.now() / 200) + this.seed) * this.wiggleFactor;
    }

    draw() {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#4d4637';
        ctx.fillStyle = '#7209b7'; 
        
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            let angle = (i * Math.PI) / 4;
            let offset = (i % 2 === 0) ? this.radius : this.radius - 6;
            let sx = this.x + offset * Math.cos(angle);
            let sy = this.y + offset * Math.sin(angle);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // draging eye into enemies
        ctx.fillStyle = '#fff';
        drawDoodleCircle(ctx, this.x - 7, this.y - 4, 5, '#4d4637', '#fff', 2);
        drawDoodleCircle(ctx, this.x + 7, this.y - 4, 5, '#4d4637', '#fff', 2);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 9, this.y - 6, 3, 3);
        ctx.fillRect(this.x + 5, this.y - 6, 3, 3);
        ctx.restore();
    }
}

class CollectableItem {
    constructor() {
        this.x = Math.random() * (canvas.width - 40) + 20;
        this.y = -20;
        this.speed = 3;
        
        this.type = Math.random() > 0.75 ? 'shield' : 'star';
        this.radius = 16;
    }

    update() { this.y += this.speed; }

    draw() {
        ctx.save();
        if (this.type === 'star') {
            ctx.fillStyle = '#ffd166';
            ctx.strokeStyle = '#4d4637';
            ctx.lineWidth = 3;
            ctx.beginPath();
           
            for (let i = 0; i < 10; i++) {
                let angle = (i * Math.PI) / 5;
                let r = (i % 2 === 0) ? this.radius : this.radius / 2;
                ctx.lineTo(this.x + r * Math.cos(angle), this.y + r * Math.sin(angle));
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
      
            ctx.fillStyle = '#4cc9f0';
            ctx.strokeStyle = '#4d4637';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 14);
            ctx.lineTo(this.x + 12, this.y - 6);
            ctx.lineTo(this.x + 10, this.y + 8);
            ctx.quadraticCurveTo(this.x, this.y + 16, this.x, this.y + 16);
            ctx.quadraticCurveTo(this.x - 10, this.y + 8, this.x - 10, this.y + 8);
            ctx.lineTo(this.x - 12, this.y - 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }
}

class PaperParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 6 + 3;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.02;
        this.vx = (Math.random() - 0.5) * 7;
        this.vy = (Math.random() - 0.5) * 7;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
    
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

function triggerScreenShake() {
    container.classList.add('shake');
    setTimeout(() => {
        container.classList.remove('shake');
    }, 300);
}

function spawnExplosionScraps(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push(new PaperParticle(x, y, color));
    }
}

function hitDetection(obj1, obj2) {
    let distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
    return distance < obj1.radius + obj2.radius;
}

let spawnTimer = 0;
let itemTimer = 0;

function gameLoop() {
    if (!gameActive) return;

    drawNotebookBackground();

   
    let now = Date.now();
    let dynamicInterval = Math.max(350, 1200 - (score / 15));
    if (now - spawnTimer > dynamicInterval) {
        enemies.push(new InkMonster());
        spawnTimer = now;
    }
    if (now - itemTimer > 6000) {
        items.push(new CollectableItem());
        itemTimer = now;
    }


    player.update();
    player.draw();

  
    for (let b = bullets.length - 1; b >= 0; b--) {
        bullets[b].update();
        bullets[b].draw();
        if (bullets[b].y < 0) bullets.splice(b, 1);
    }

    for (let i = items.length - 1; i >= 0; i--) {
        let entry = items[i];
        entry.update();
        entry.draw();

        if (hitDetection(player, entry)) {
            spawnExplosionScraps(entry.x, entry.y, entry.type === 'star' ? '#ffd166' : '#4cc9f0', 15);
            if (entry.type === 'star') {
                multiplier += 0.2;
                score += Math.floor(150 * multiplier);
            } else {
                hasShield = true;
                shieldTimer = Date.now() + 5000; // Shield safe length window setup 5 seconds
                shieldDisplay.classList.remove('hidden');
            }
            scoreDisplay.innerText = score;
            multiplierDisplay.innerText = multiplier.toFixed(1);
            items.splice(i, 1);
            continue;
        }
        if (entry.y > canvas.height + 20) items.splice(i, 1);
    }

    for (let e = enemies.length - 1; e >= 0; e--) {
        let enemy = enemies[e];
        enemy.update();
        enemy.draw();

      
        if (hitDetection(player, enemy)) {
            spawnExplosionScraps(enemy.x, enemy.y, '#7209b7', 20);
            enemies.splice(e, 1);
            triggerScreenShake();

            if (hasShield) {
                hasShield = false;
                shieldDisplay.classList.add('hidden');
            } else {
                lives--;
                multiplier = Math.max(1.0, multiplier - 0.4);
                livesDisplay.innerText = '♥'.repeat(lives);
                multiplierDisplay.innerText = multiplier.toFixed(1);
                
                if (lives <= 0) {
                    gameActive = false;
                    finalScoreDisplay.innerText = score;
                    gameOverScreen.classList.remove('hidden');
                    return;
                }
            }
            continue;
        }


        for (let b = bullets.length - 1; b >= 0; b--) {
            if (hitDetection(bullets[b], enemy)) {
                spawnExplosionScraps(enemy.x, enemy.y, '#7209b7', 12);
                score += Math.floor(50 * multiplier);
                scoreDisplay.innerText = score;
                enemies.splice(e, 1);
                bullets.splice(b, 1);
                break;
            }
        }

        if (enemy.y > canvas.height + 30) enemies.splice(e, 1);
    }

  
    for (let p = particles.length - 1; p >= 0; p--) {
        particles[p].update();
        particles[p].draw();
        if (particles[p].alpha <= 0) particles.splice(p, 1);
    }

    requestAnimationFrame(gameLoop);
}

function resetEngine() {
    score = 0;
    multiplier = 1.0;
    lives = 3;
    hasShield = false;
    bullets = [];
    enemies = [];
    items = [];
    particles = [];
    player = new PlayerRocket();

    scoreDisplay.innerText = score;
    multiplierDisplay.innerText = multiplier.toFixed(1);
    livesDisplay.innerText = '♥♥♥';
    shieldDisplay.classList.add('hidden');

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    spawnTimer = Date.now();
    itemTimer = Date.now();
    gameActive = true;
    requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', resetEngine);
restartBtn.addEventListener('click', resetEngine);