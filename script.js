const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

let gameActive = false, score = 0, lives = 3, player, enemies = [];

const mouse = { x: 512, y: 600 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// Spacebar Super Eraser
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && score >= 500) {
        score -= 500;
        enemies = [];
        scoreDisplay.innerText = score;
    }
});

class Player {
    constructor() { this.x = 512; this.y = 600; }
    
    draw() {
        ctx.save();
        ctx.strokeStyle = '#4d4637';
        ctx.fillStyle = '#4cc9f0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        
        // Funky Wiggle Effect
        let wobble = Math.sin(Date.now() / 100) * 8;
        
        ctx.moveTo(this.x, this.y - 35 + wobble);
        ctx.lineTo(this.x - 25, this.y + 20);
        ctx.lineTo(this.x + 25, this.y + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    update() {
        this.x += (mouse.x - this.x) * 0.1;
        this.y += (mouse.y - this.y) * 0.1;
    }
}

class Enemy {
    constructor() {
        this.x = Math.random() * 1000;
        this.y = -50;
        this.radius = 25;
    }
    update() { this.y += 4; }
    draw() {
        ctx.fillStyle = '#7209b7';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function gameLoop() {
    if (!gameActive) return;
    
    ctx.clearRect(0, 0, 1024, 768);
    
    if (Math.random() < 0.03) enemies.push(new Enemy());
    
    player.update();
    player.draw();
    
    enemies.forEach((e, i) => {
        e.update();
        e.draw();
        
        // Collision
        if (Math.hypot(e.x - player.x, e.y - player.y) < 45) {
            lives--;
            enemies.splice(i, 1);
            livesDisplay.innerText = '♥'.repeat(lives);
            if (lives <= 0) {
                gameActive = false;
                gameOverScreen.classList.remove('hidden');
            }
        }
    });
    
    score++;
    scoreDisplay.innerText = score;
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    lives = 3;
    enemies = [];
    scoreDisplay.innerText = score;
    livesDisplay.innerText = '♥♥♥';
    gameActive = true;
    player = new Player();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

document.getElementById('start-btn').addEventListener('click', resetGame);
document.getElementById('restart-btn').addEventListener('click', resetGame);