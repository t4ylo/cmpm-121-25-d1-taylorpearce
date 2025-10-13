import beeImage from "./beebee.webp";
import "./style.css";

const container = document.createElement("div");
container.className = "bee-container";
container.style.position = "relative";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.alignItems = "center";
container.style.justifyContent = "center";
container.style.height = "100vh";
container.style.backgroundColor = "#fff9d6";
document.body.append(container);

const counterDiv: HTMLDivElement = document.createElement("div");
counterDiv.id = "counterDiv";
counterDiv.textContent = "Bees Clicked: 0";
counterDiv.style.position = "absolute";
counterDiv.style.top = "16px";
counterDiv.style.left = "16px";
counterDiv.style.padding = "6px 12px";
counterDiv.style.borderRadius = "8px";
counterDiv.style.fontWeight = "600";
counterDiv.style.fontFamily = "sans-serif";
counterDiv.style.color = "#333";
counterDiv.style.zIndex = "1000";
counterDiv.style.background = "rgba(255, 255, 255, 0.6)";
counterDiv.style.backdropFilter = "blur(4px)";
counterDiv.style.boxShadow = "0 0 10px rgba(255, 255, 200, 0.4)";

const statsDiv = document.createElement("div");
statsDiv.style.position = "absolute";
statsDiv.style.top = "56px";
statsDiv.style.left = "16px";
statsDiv.style.padding = "6px 10px";
statsDiv.style.borderRadius = "8px";
statsDiv.style.background = "rgba(255,255,255,0.6)";
statsDiv.style.backdropFilter = "blur(4px)";
statsDiv.style.font = "600 12px system-ui, sans-serif";
statsDiv.style.color = "#333";
statsDiv.style.zIndex = "1000";

const workerCountSpan = document.createElement("span");
const droneCountSpan = document.createElement("span");
const queenCountSpan = document.createElement("span");
const totalRateSpan = document.createElement("span");

statsDiv.append(
  document.createTextNode("Workers: "),
  workerCountSpan,
  document.createTextNode("  •  Drones: "),
  droneCountSpan,
  document.createTextNode("  •  Queens: "),
  queenCountSpan,
  document.createTextNode("  •  Total rate: "),
  totalRateSpan,
  document.createTextNode("/sec"),
);

container.appendChild(statsDiv);

const beeWrap = document.createElement("div");
beeWrap.className = "bee-wrap";

const beeImg: HTMLImageElement = document.createElement("img");
beeImg.src = beeImage;
beeImg.alt = "Bee";
beeImg.className = "bee-image";
beeImg.style.transform = "scale(0.4)";
beeImg.style.cursor = "pointer";
beeImg.style.zIndex = "2";

beeWrap.appendChild(beeImg);

let counter = 0;
let workers = 0;
let drones = 0;
let queens = 0;

const WORKER_RATE = 0.1;
const DRONE_RATE = 2.0;
const QUEEN_RATE = 50.0;
const WORKER_COST = 10;
const DRONE_COST = 100;
const QUEEN_COST = 1000;

function totalRate(): number {
  return workers * WORKER_RATE + drones * DRONE_RATE + queens * QUEEN_RATE;
}

function renderCount() {
  counterDiv.textContent = `Bees Clicked: ${counter.toFixed(1)}`;

  workerBee.disabled = counter < WORKER_COST;

  workerBee.textContent =
    `Hire Worker Bee (+0.1/sec) — Cost: ${WORKER_COST} — ` +
    `Rate: ${(workers * WORKER_RATE).toFixed(1)} Bees/sec`;

  droneBee.disabled = counter < DRONE_COST;

  droneBee.textContent = `Hire Drone Bee (+2.0/sec) — Cost: ${DRONE_COST} — ` +
    `Rate: ${(drones * DRONE_RATE).toFixed(1)} Bees/sec`;

  queenBee.disabled = counter < QUEEN_COST;

  queenBee.textContent = `Hire Queen Bee (+50.0/sec) — Cost: ${QUEEN_COST} — ` +
    `Rate: ${(queens * QUEEN_RATE).toFixed(1)} Bees/sec`;

  workerCountSpan.textContent = `${workers}`;
  droneCountSpan.textContent = `${drones}`;
  queenCountSpan.textContent = `${queens}`;

  totalRateSpan.textContent = `${totalRate().toFixed(1)}`;
}

function bounce() {
  beeWrap.classList.remove("bounce");
  void beeWrap.offsetWidth;
  beeWrap.classList.add("bounce");
}

beeImg.addEventListener("click", () => {
  counter += 1;
  renderCount();
  bounce();
});

const btn: HTMLButtonElement = document.createElement("button");
btn.textContent = "🐝 Click the Bee!";
btn.style.marginTop = "20px";
btn.style.padding = "8px 14px";
btn.style.fontSize = "14px";
btn.style.backgroundColor = "#f6de6d";
btn.style.color = "#000";
btn.style.border = "none";
btn.style.borderRadius = "8px";
btn.style.cursor = "pointer";
btn.style.zIndex = "3";
btn.addEventListener("click", () => {
  counter += 1;
  renderCount();
  bounce();
});

const workerBee: HTMLButtonElement = document.createElement("button");
workerBee.style.position = "absolute";
workerBee.style.top = "275px";
workerBee.style.right = "50px";
workerBee.style.padding = "8px 14px";
workerBee.style.fontSize = "14px";
workerBee.style.backgroundColor = "#f6de6d";
workerBee.style.color = "#000";
workerBee.style.border = "none";
workerBee.style.borderRadius = "10px";
workerBee.style.cursor = "pointer";
workerBee.disabled = true;
container.appendChild(workerBee);

workerBee.addEventListener("click", () => {
  if (counter >= WORKER_COST) {
    counter -= WORKER_COST;
    workers += 1;
    renderCount();
  }
});

const droneBee: HTMLButtonElement = document.createElement("button");
droneBee.style.position = "absolute";
droneBee.style.top = "375px";
droneBee.style.right = "50px";
droneBee.style.padding = "8px 14px";
droneBee.style.fontSize = "14px";
droneBee.style.backgroundColor = "#f6de6d";
droneBee.style.color = "#000";
droneBee.style.border = "none";
droneBee.style.borderRadius = "10px";
droneBee.style.cursor = "pointer";
droneBee.disabled = true;
container.appendChild(droneBee);

droneBee.addEventListener("click", () => {
  if (counter >= DRONE_COST) {
    counter -= DRONE_COST;
    drones += 1;
    renderCount();
  }
});

const queenBee: HTMLButtonElement = document.createElement("button");
queenBee.style.position = "absolute";
queenBee.style.top = "475px";
queenBee.style.right = "50px";
queenBee.style.padding = "8px 14px";
queenBee.style.fontSize = "14px";
queenBee.style.backgroundColor = "#f6de6d";
queenBee.style.color = "#000";
queenBee.style.border = "none";
queenBee.style.borderRadius = "10px";
queenBee.style.cursor = "pointer";
queenBee.disabled = true;
container.appendChild(queenBee);

queenBee.addEventListener("click", () => {
  if (counter >= QUEEN_COST) {
    counter -= QUEEN_COST;
    queens += 1;
    renderCount();
  }
});

let lastFrame = performance.now();

function frame(now: number) {
  const dtSeconds = (now - lastFrame) / 1000;
  lastFrame = now;

  counter += totalRate() * dtSeconds;

  renderCount();

  requestAnimationFrame(frame);
}

requestAnimationFrame((t) => {
  lastFrame = t;
  requestAnimationFrame(frame);
});

container.append(beeWrap, counterDiv, btn);

renderCount();
