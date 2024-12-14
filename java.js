const canvas = document.getElementById('c');
const c = canvas.getContext('2d');
c.fillStyle = "#FFF";
c.font = "60px monospace";

let w = 1, s = 1;
let a = 0, b = 0; // Scores
let m = 190, n = 190; // Paddle positions
let x = 300, y = 235; // Ball position
let u = -5, v = 3; // Ball velocity

const paddleSpeed = 5;
const paddleHeight = 100;
const paddleWidth = 20;
const ballSize = 10;

// AI parameters
let leftAI = { reward: 0, punishment: 0, speed: 3 };
let rightAI = { reward: 0, punishment: 0, speed: 3 };

function resetBall() {
  x = 320;
  y = 240;
  u = Math.random() > 0.5 ? 5 : -5;
  v = (Math.random() - 0.5) * 8;
}

function moveAI(ai, paddleY, ballY) {
  const targetY = ballY - paddleHeight / 2;
  if (paddleY < targetY) {
    return Math.min(ai.speed, targetY - paddleY);
  } else if (paddleY > targetY) {
    return -Math.min(ai.speed, paddleY - targetY);
  }
  return 0;
}

function updateAI(ai, hitSuccess) {
  if (hitSuccess) {
    ai.reward++;
    ai.speed = Math.min(ai.speed + 0.1, 6); // Increase speed with rewards
  } else {
    ai.punishment++;
    ai.speed = Math.max(ai.speed - 0.1, 2); // Decrease speed with punishments
  }
}

setInterval(() => {
  if (!w && !s) return;
  s = 0;
  c.clearRect(0, 0, 640, 480);

  // Draw dashed line
  for (let i = 5; i < 480; i += 20) c.fillRect(318, i, 4, 10);

  // Update paddle positions
  m += moveAI(leftAI, m, y);
  n += moveAI(rightAI, n, y);

  // Clamp paddle positions
  m = Math.max(0, Math.min(m, 380));
  n = Math.max(0, Math.min(n, 380));

  // Update ball position
  x += u;
  y += v;

  // Ball collision with top and bottom walls
  if (y <= 0 || y >= 470) v = -v;

  // Ball collision with paddles
  if (x <= 40 && x >= 20 && y > m - 10 && y < m + paddleHeight + 10) {
    u = -u + 0.2;
    v += (y - (m + paddleHeight / 2)) / 10;
    updateAI(leftAI, true);
  } else if (x <= 0) {
    b++;
    resetBall();
    updateAI(leftAI, false);
  }

  if (x >= 600 && x <= 620 && y > n - 10 && y < n + paddleHeight + 10) {
    u = -u - 0.2;
    v += (y - (n + paddleHeight / 2)) / 10;
    updateAI(rightAI, true);
  } else if (x >= 640) {
    a++;
    resetBall();
    updateAI(rightAI, false);
  }

  // Draw scores
  c.fillText(`${a} ${b}`, 266, 60);

  // Draw paddles
  c.fillRect(20, m, paddleWidth, paddleHeight);
  c.fillRect(600, n, paddleWidth, paddleHeight);

  // Draw ball
  c.fillRect(x, y, ballSize, ballSize);
}, 30);

document.onkeydown = (e) => {
  const k = (e || window.event).keyCode;
  if (w && k === 27) w = 0;
};

document.onkeyup = (e) => {
  const k = (e || window.event).keyCode;
  if (!w && k === 27) w = 1;
};
