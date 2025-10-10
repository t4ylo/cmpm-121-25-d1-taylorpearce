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
counterDiv.textContent = "bees clicked: 0";
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
let beesPerSecond = 0;

function renderCount() {
  counterDiv.textContent = `bees clicked: ${Math.floor(counter).toFixed(2)}`;

  workerBee.disabled = counter < 10;

  workerBee.textContent =
    `Hire Worker Bee (+1/s) — Cost: 10 — Rate: ${beesPerSecond}/s`;
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
workerBee.style.top = "150px";
workerBee.style.right = "50px";
workerBee.style.padding = "8px 14px";
workerBee.style.fontSize = "14px";
workerBee.style.backgroundColor = "#f6de6d";
workerBee.style.color = "#000";
workerBee.style.border = "none";
workerBee.style.borderRadius = "10px";
workerBee.style.cursor = "pointer";
workerBee.disabled = true; // start disabled until you have 10
container.appendChild(workerBee);

workerBee.addEventListener("click", () => {
  if (counter >= 10) {
    counter -= 10;
    beesPerSecond += 1;
    renderCount();
  }
});

let lastFrame = performance.now();

function frame(now: number) {
  const dtSeconds = (now - lastFrame) / 1000;
  lastFrame = now;

  counter += beesPerSecond * dtSeconds;

  renderCount();

  requestAnimationFrame(frame);
}

requestAnimationFrame((t) => {
  lastFrame = t;
  requestAnimationFrame(frame);
});

container.append(beeWrap, counterDiv, btn);

renderCount();
