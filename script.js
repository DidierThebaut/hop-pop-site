/* ==========================================================================
   Hop & Pop! - Chupa Chups Stade de France Family Race
   JavaScript (script.js)
   ========================================================================== */

// --- Countdown Timer ---
const targetDate = new Date().getTime() + (45 * 24 * 60 * 60 * 1000); // 45 days from now

function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById('days').innerText = days;
  document.getElementById('hours').innerText = hours;
  document.getElementById('minutes').innerText = minutes;
  document.getElementById('seconds').innerText = seconds;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- Relay Zones Switcher ---
const zonesData = [
  {
    title: "Leg 1: Strawberry Burst (Kids 100m)",
    desc: "The ultimate explosive start! Junior racers hop in lightweight strawberry wrapper sacks to set the pace for their team.",
    specs: ["Distance: 100 Meters", "Participant: Kid Racer (Ages 6 - 14)", "Gear: Strawberry Twist-Top Sack"],
    previewText: "🍓 Strawberry Wrapper Sack",
    bgColor: "#FFE6E8"
  },
  {
    title: "Leg 2: Cola Rush (Parents 100m)",
    desc: "Fizzy speed! Parents step into heavy-duty Cola Sacks to regain momentum on the backstretch.",
    specs: ["Distance: 100 Meters", "Participant: Parent / Adult Racer", "Gear: Fizzy Cola Sack"],
    previewText: "🥤 Cola Rush Sack",
    bgColor: "#FBE6D6"
  },
  {
    title: "Leg 3: Vanilla Crunch (Sprint Hop 100m)",
    desc: "Smooth navigation! The third leg requires precision hopping around flavor obstacles.",
    specs: ["Distance: 100 Meters", "Participant: Any Squad Member", "Gear: Vanilla Crunch Sack"],
    previewText: "🍦 Creamy Vanilla Sack",
    bgColor: "#FFFDF0"
  },
  {
    title: "Leg 4: Apple Duo (Parent + Kid 100m)",
    desc: "The grand finale! Parent and child hop together in a double-wide wrapper sack carrying a giant lollipop baton across the finish line!",
    specs: ["Distance: 100 Meters", "Participant: Duo (Parent + Kid)", "Gear: Double-Wide Apple Sack + Inflatable Baton"],
    previewText: "🍏 Apple Duo Wrapper Sack",
    bgColor: "#EAF9E6"
  }
];

function switchZone(index) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  const zone = zonesData[index];
  document.getElementById('zoneTitle').innerText = zone.title;
  document.getElementById('zoneDesc').innerText = zone.desc;
  
  const specsList = document.querySelector('.zone-specs');
  specsList.innerHTML = zone.specs.map(spec => {
    const parts = spec.split(':');
    return `<li><strong>${parts[0]}:</strong>${parts[1]}</li>`;
  }).join('');

  const preview = document.getElementById('sackPreview');
  preview.innerText = zone.previewText;
  preview.style.backgroundColor = zone.bgColor;
}

// --- Live Bib Update ---
function updateBib() {
  const name = document.getElementById('teamName').value || 'The Hopping Heroes';
  const num = document.getElementById('bibNumber').value || '77';
  const flavor = document.getElementById('flavorChoice').value;

  document.getElementById('previewTeam').innerText = name;
  document.getElementById('previewBib').innerText = '#' + num;
  document.getElementById('previewFlavor').innerText = flavor;
}

document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('🎉 Team Registered! See you at Stade de France!');
});

// --- Mini Hop Arcade Game ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let score = 0;
let hopper = { x: 50, y: 220, width: 30, height: 40, dy: 0, gravity: 0.6, jump: -12, grounded: true };
let obstacles = [];
let gameInterval;

function drawHopper() {
  ctx.fillStyle = '#E30613'; // Chupa Red
  ctx.fillRect(hopper.x, hopper.y, hopper.width, hopper.height);
  
  // Head / Lollipop top
  ctx.beginPath();
  ctx.arc(hopper.x + 15, hopper.y - 10, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#FFDD00';
  ctx.fill();
}

function drawObstacles() {
  ctx.fillStyle = '#1A1A24';
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateGame() {
  if (!gameRunning) return;

  // Hopper physics
  hopper.dy += hopper.gravity;
  hopper.y += hopper.dy;

  if (hopper.y >= 220) {
    hopper.y = 220;
    hopper.dy = 0;
    hopper.grounded = true;
  }

  // Move obstacles
  obstacles.forEach((obs, index) => {
    obs.x -= 5;

    // Collision check
    if (
      hopper.x < obs.x + obs.width &&
      hopper.x + hopper.width > obs.x &&
      hopper.y < obs.y + obs.height &&
      hopper.y + hopper.height > obs.y
    ) {
      gameRunning = false;
      alert(`Game Over! Final Score: ${score}`);
    }

    // Passed obstacle
    if (obs.x + obs.width < 0) {
      obstacles.splice(index, 1);
      score += 10;
      document.getElementById('gameScore').innerText = score;
    }
  });

  // Spawn obstacles
  if (Math.random() < 0.02 && (obstacles.length === 0 || canvas.width - obstacles[obstacles.length - 1].x > 200)) {
    obstacles.push({ x: canvas.width, y: 235, width: 25, height: 25 });
  }

  // Render frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Track ground
  ctx.fillStyle = '#78B82A';
  ctx.fillRect(0, 260, canvas.width, 40);

  drawHopper();
  drawObstacles();

  requestAnimationFrame(updateGame);
}

function startGame() {
  score = 0;
  document.getElementById('gameScore').innerText = score;
  obstacles = [];
  hopper.y = 220;
  gameRunning = true;
  updateGame();
}

window.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (hopper.grounded && gameRunning) {
      hopper.dy = hopper.jump;
      hopper.grounded = false;
    }
  }
});
