const modeButtons = document.querySelectorAll(".mode-btn");
const panels = document.querySelectorAll(".panel");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    modeButtons.forEach((btn) => btn.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));
    button.classList.add("is-active");
    document.getElementById(target).classList.add("is-active");
  });
});

const cube3d = document.getElementById("cube-3d");
const rotateLeftBtn = document.getElementById("rotate-left-btn");
const rotateRightBtn = document.getElementById("rotate-right-btn");
const autoSpinBtn = document.getElementById("auto-spin-btn");
const supersonicSpinBtn = document.getElementById("supersonic-spin-btn");

let cubeY = -30;
let cubeX = -20;
let autoSpin = false;
let supersonicSpin = false;
let cubeSpinTimer = null;
let currentSpinStep = 1.5;
let currentSpinIntervalMs = 16;
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playWeirdSound(type = "blip") {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();

  osc.connect(gain);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.0001, now);

  if (type === "fahhh") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.65);

    lfo.type = "triangle";
    lfo.frequency.setValueAtTime(6, now);
    lfoGain.gain.setValueAtTime(25, now);

    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.72);
    lfo.stop(now + 0.72);
    return;
  }

  if (type === "spin") {
    osc.type = "square";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.14);
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(10, now);
    lfoGain.gain.setValueAtTime(10, now);

    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.18);
    lfo.stop(now + 0.18);
    return;
  }

  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  osc.start(now);
  osc.stop(now + 0.14);
}

function renderCubeRotation() {
  if (!cube3d) return;
  cube3d.style.transform = `rotateX(${cubeX}deg) rotateY(${cubeY}deg)`;
}

function startAutoSpin() {
  if (cubeSpinTimer) return;
  cubeSpinTimer = setInterval(() => {
    cubeY += currentSpinStep;
    renderCubeRotation();
  }, currentSpinIntervalMs);
}

function stopAutoSpin() {
  if (!cubeSpinTimer) return;
  clearInterval(cubeSpinTimer);
  cubeSpinTimer = null;
}

if (rotateLeftBtn) {
  rotateLeftBtn.addEventListener("click", () => {
    cubeY -= 18;
    renderCubeRotation();
    playWeirdSound("blip");
  });
}

if (rotateRightBtn) {
  rotateRightBtn.addEventListener("click", () => {
    cubeY += 18;
    renderCubeRotation();
    playWeirdSound("blip");
  });
}

if (autoSpinBtn) {
  autoSpinBtn.addEventListener("click", () => {
    playWeirdSound("spin");
    supersonicSpin = false;
    currentSpinStep = 1.5;
    currentSpinIntervalMs = 16;

    if (supersonicSpinBtn) {
      supersonicSpinBtn.textContent = "Supersonic Spin";
      supersonicSpinBtn.classList.remove("is-on");
    }

    autoSpin = !autoSpin;
    autoSpinBtn.textContent = autoSpin ? "Stop Spin" : "Auto Spin";
    autoSpinBtn.classList.toggle("is-on", autoSpin);

    stopAutoSpin();
    if (autoSpin) startAutoSpin();
  });
}

if (supersonicSpinBtn) {
  supersonicSpinBtn.addEventListener("click", () => {
    playWeirdSound("fahhh");
    supersonicSpin = !supersonicSpin;
    autoSpin = false;

    autoSpinBtn.textContent = "Auto Spin";
    autoSpinBtn.classList.remove("is-on");

    currentSpinStep = supersonicSpin ? 20 : 1.5;
    currentSpinIntervalMs = supersonicSpin ? 8 : 16;

    supersonicSpinBtn.textContent = supersonicSpin
      ? "Stop Supersonic"
      : "Supersonic Spin";
    supersonicSpinBtn.classList.toggle("is-on", supersonicSpin);

    stopAutoSpin();
    if (supersonicSpin) startAutoSpin();
  });
}

const teachingSteps = [
  {
    title: "Cross - Build a white cross",
    body: "Start by solving the white edge pieces around the center.",
    moves: ["F", "R", "U", "R'", "U'"],
  },
  {
    title: "First Layer Corners",
    body: "Insert white corners without breaking your solved cross.",
    moves: ["R", "U", "R'", "U'"],
  },
  {
    title: "Second Layer Edges",
    body: "Use right/left insertion algorithms for middle layer edges.",
    moves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
  },
  {
    title: "OLL - Orient Last Layer",
    body: "Orient all yellow stickers on top with beginner-friendly cases.",
    moves: ["F", "R", "U", "R'", "U'", "F'"],
  },
  {
    title: "PLL - Permute Last Layer",
    body: "Finish by moving pieces to their final positions efficiently.",
    moves: ["R'", "F", "R'", "B2", "R", "F'", "R'", "B2", "R2"],
  },
];

let stepIndex = 0;
const stepTitle = document.getElementById("step-title");
const stepBody = document.getElementById("step-body");
const moveStrip = document.getElementById("move-strip");

function renderTeachingStep() {
  const step = teachingSteps[stepIndex];
  stepTitle.textContent = step.title;
  stepBody.textContent = step.body;
  moveStrip.innerHTML = step.moves
    .map((move) => `<span class="move-token">${move}</span>`)
    .join("");
}

document.getElementById("next-step-btn").addEventListener("click", () => {
  stepIndex = (stepIndex + 1) % teachingSteps.length;
  renderTeachingStep();
  playWeirdSound("blip");
});

document.getElementById("prev-step-btn").addEventListener("click", () => {
  stepIndex = (stepIndex - 1 + teachingSteps.length) % teachingSteps.length;
  renderTeachingStep();
  playWeirdSound("blip");
});

const coachReplies = [
  "Practice slow solves. Turning slower with better lookahead often gives faster total times.",
  "Try solving the cross on bottom every solve. It reduces cube rotations and improves flow.",
  "Track your first pair during inspection; this is one of the easiest speed gains.",
  "For OLL/PLL, focus on recognition first, then finger tricks.",
];

const drillIdeas = [
  "Drill: Solve only the cross + first pair repeatedly for 8 minutes.",
  "Drill: Perform 20 right-trigger repetitions with accurate finger tricks.",
  "Drill: Do 5 untimed solves with zero regrips goal.",
  "Drill: Practice F2L pair insertion from both left and right cases.",
];

const coachThread = document.getElementById("coach-thread");
const drillBox = document.getElementById("drill-box");

document.getElementById("coach-tip-btn").addEventListener("click", () => {
  const reply = coachReplies[Math.floor(Math.random() * coachReplies.length)];
  const bubble = document.createElement("div");
  bubble.className = "chat bubble ai";
  bubble.textContent = reply;
  coachThread.appendChild(bubble);
  coachThread.scrollTop = coachThread.scrollHeight;
  playWeirdSound("fahhh");
});

document.getElementById("drill-btn").addEventListener("click", () => {
  const drill = drillIdeas[Math.floor(Math.random() * drillIdeas.length)];
  drillBox.textContent = drill;
  playWeirdSound("blip");
});

const moves = ["R", "L", "U", "D", "F", "B"];
const modifiers = ["", "'", "2"];

function generateScramble(length = 20) {
  const scramble = [];
  let prevMove = "";

  for (let i = 0; i < length; i += 1) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === prevMove);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(`${move}${modifier}`);
    prevMove = move;
  }

  return scramble.join(" ");
}

const scrambleText = document.getElementById("scramble-text");
document.getElementById("new-scramble-btn").addEventListener("click", () => {
  scrambleText.textContent = generateScramble();
  playWeirdSound("blip");
});

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const plusTwoBtn = document.getElementById("plus-two-btn");
const dnfBtn = document.getElementById("dnf-btn");

let intervalId = null;
let startTime = 0;
let elapsed = 0;
let latestSolveIndex = -1;
const solves = [];

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}.${String(hundredths).padStart(2, "0")}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(elapsed);
}

function updateStats() {
  const validSolves = solves.filter((s) => s.status !== "DNF");
  const bestNode = document.getElementById("best-stat");
  const avgNode = document.getElementById("avg-stat");
  const countNode = document.getElementById("count-stat");

  countNode.textContent = solves.length.toString();

  if (!validSolves.length) {
    bestNode.textContent = "--";
    avgNode.textContent = "--";
    return;
  }

  const best = Math.min(...validSolves.map((s) => s.time));
  const average =
    validSolves.reduce((sum, solve) => sum + solve.time, 0) / validSolves.length;

  bestNode.textContent = formatTime(best);
  avgNode.textContent = formatTime(Math.round(average));
}

function renderHistory() {
  const historyBody = document.getElementById("history-body");
  historyBody.innerHTML = "";

  solves
    .slice()
    .reverse()
    .forEach((solve, idx) => {
      const tr = document.createElement("tr");
      const displayIndex = solves.length - idx;
      const timeText = solve.status === "DNF" ? "--" : formatTime(solve.time);
      const statusClass =
        solve.status === "DNF"
          ? "status-dnf"
          : solve.status === "+2"
          ? "status-plus2"
          : "";
      tr.innerHTML = `<td>${displayIndex}</td><td>${timeText}</td><td class="${statusClass}">${solve.status}</td>`;
      historyBody.appendChild(tr);
    });
}

function saveSolve(time, status = "OK") {
  solves.push({ time, status });
  latestSolveIndex = solves.length - 1;
  renderHistory();
  updateStats();
}

startBtn.addEventListener("click", () => {
  if (intervalId) return;
  startTime = Date.now() - elapsed;
  intervalId = setInterval(() => {
    elapsed = Date.now() - startTime;
    renderTimer();
  }, 10);
  playWeirdSound("spin");
});

stopBtn.addEventListener("click", () => {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
  saveSolve(elapsed, "OK");
  playWeirdSound("fahhh");
});

resetBtn.addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  elapsed = 0;
  latestSolveIndex = -1;
  renderTimer();
  playWeirdSound("blip");
});

plusTwoBtn.addEventListener("click", () => {
  if (latestSolveIndex < 0) return;
  const solve = solves[latestSolveIndex];
  if (solve.status === "DNF") return;
  solve.time += 2000;
  solve.status = "+2";
  renderHistory();
  updateStats();
  playWeirdSound("spin");
});

dnfBtn.addEventListener("click", () => {
  if (latestSolveIndex < 0) return;
  solves[latestSolveIndex].status = "DNF";
  renderHistory();
  updateStats();
  playWeirdSound("fahhh");
});

const lessonGroups = document.querySelectorAll(".lesson-list");

function updateModuleProgress(module) {
  const group = document.querySelector(`.lesson-list[data-module="${module}"]`);
  const lessons = group.querySelectorAll("input[data-lesson]");
  const checked = [...lessons].filter((item) => item.checked).length;
  const percent = Math.round((checked / lessons.length) * 100);
  document.getElementById(`module-${module}-progress`).textContent = `${percent}%`;
  document.getElementById(`module-${module}-bar`).style.width = `${percent}%`;
}

lessonGroups.forEach((group) => {
  const module = group.dataset.module;
  group.querySelectorAll("input[data-lesson]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateModuleProgress(module);
      playWeirdSound("blip");
    });
  });
  updateModuleProgress(module);
});

scrambleText.textContent = generateScramble();
renderTeachingStep();
renderTimer();
renderCubeRotation();
