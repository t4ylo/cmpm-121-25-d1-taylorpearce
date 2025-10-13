import beeImage from "./beebee.webp";
import honeycombImage from "./honeycomb.png";
import "./style.css";

const container = document.createElement("div");
container.style.position = "relative";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.alignItems = "center";
container.style.justifyContent = "center";
container.style.height = "100vh";
container.style.backgroundColor = "#fff9d6";
document.body.append(container);

const counterDiv = document.createElement("div");
counterDiv.style.position = "absolute";
counterDiv.style.top = "16px";
counterDiv.style.left = "16px";
counterDiv.style.padding = "6px 12px";
counterDiv.style.borderRadius = "8px";
counterDiv.style.fontWeight = "600";
counterDiv.style.fontFamily = "system-ui, sans-serif";
counterDiv.style.color = "#333";
counterDiv.style.zIndex = "1000";
counterDiv.style.background = "rgba(255, 255, 255, 0.6)";
counterDiv.style.backdropFilter = "blur(4px)";
counterDiv.style.boxShadow = "0 0 10px rgba(255, 255, 200, 0.4)";
container.append(counterDiv);

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
container.append(statsDiv);

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
  document.createTextNode(" Honey/sec"),
);

const mainButton = document.createElement("div");
mainButton.className = "main-button";
mainButton.style.position = "relative";
mainButton.style.display = "inline-block";
mainButton.style.cursor = "pointer";
mainButton.style.width = "200px";
mainButton.style.height = "200px";
mainButton.style.marginBottom = "12px";

const honeycombImg = document.createElement("img");
honeycombImg.src = honeycombImage;
honeycombImg.alt = "Honeycomb";
honeycombImg.className = "honeycomb-image";
honeycombImg.style.width = "100%";
honeycombImg.style.height = "100%";
honeycombImg.style.objectFit = "contain";
honeycombImg.style.borderRadius = "16px";

const beeImg: HTMLImageElement = document.createElement("img");
beeImg.src = beeImage;
beeImg.alt = "Bee";
beeImg.className = "bee-image";
beeImg.style.position = "absolute";
beeImg.style.top = "78%";
beeImg.style.left = "30%";
beeImg.style.transform = "translate(-50%, -50%) scale(0.38)";
beeImg.style.zIndex = "2";
beeImg.style.pointerEvents = "none";

mainButton.append(honeycombImg, beeImg);
container.append(mainButton);

const clickHintBtn = document.createElement("button");
clickHintBtn.textContent =
  "🐝 Tap the Honeycomb to Help Your Bee Gather Honey!";
clickHintBtn.style.position = "absolute";
clickHintBtn.style.bottom = "100px";
clickHintBtn.style.padding = "8px 14px";
clickHintBtn.style.fontSize = "14px";
clickHintBtn.style.backgroundColor = "#f6de6d";
clickHintBtn.style.color = "#000";
clickHintBtn.style.border = "none";
clickHintBtn.style.borderRadius = "8px";
clickHintBtn.style.cursor = "pointer";
clickHintBtn.style.zIndex = "3";
container.append(clickHintBtn);

const shop = document.createElement("div");
shop.style.position = "absolute";
shop.style.top = "220px";
shop.style.right = "36px";
shop.style.display = "grid";
shop.style.gap = "16px";
container.append(shop);

type ItemKey = "worker" | "drone" | "queen";
interface ItemDef {
  key: ItemKey;
  name: string;
  baseCost: number;
  rate: number;
}
const PRICE_SCALE = 1.15;

const availableItems: ItemDef[] = [
  { key: "worker", name: "Hire Worker Bee", baseCost: 10, rate: 0.1 },
  { key: "drone", name: "Hire Drone Bee", baseCost: 100, rate: 2.0 },
  { key: "queen", name: "Hire Queen Bee", baseCost: 1000, rate: 50.0 },
];

let honey = 0;
const counts: Record<ItemKey, number> = { worker: 0, drone: 0, queen: 0 };

// UI elements per item
const buttons: Record<ItemKey, HTMLButtonElement> = {
  worker: document.createElement("button"),
  drone: document.createElement("button"),
  queen: document.createElement("button"),
};

for (const def of availableItems) {
  const btn = buttons[def.key];
  btn.style.padding = "8px 14px";
  btn.style.fontSize = "14px";
  btn.style.backgroundColor = "#f6de6d";
  btn.style.color = "#000";
  btn.style.border = "none";
  btn.style.borderRadius = "10px";
  btn.style.cursor = "pointer";
  btn.disabled = true;

  btn.addEventListener("click", () => {
    const cost = currentCost(def);
    if (honey + 1e-9 >= cost) {
      honey -= cost;
      counts[def.key] += 1;
      render();
    }
  });

  shop.append(btn);
}

function currentCost(def: ItemDef): number {
  return def.baseCost * Math.pow(PRICE_SCALE, counts[def.key]);
}
function totalRate(): number {
  return availableItems.reduce((sum, d) => sum + counts[d.key] * d.rate, 0);
}

function render() {
  counterDiv.textContent = `Honey Gathered: ${honey.toFixed(1)}`;

  for (const def of availableItems) {
    const btn = buttons[def.key];
    const cost = currentCost(def);
    const owned = counts[def.key];
    const perTypeRate = owned * def.rate;

    btn.disabled = honey + 1e-9 < cost;
    btn.style.opacity = btn.disabled ? "0.7" : "1";
    btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
    btn.textContent =
      `${def.name} (+${def.rate.toFixed(1)}/sec) — Cost: ${
        cost.toFixed(1)
      } — ` +
      `Owned: ${owned} — Rate: ${perTypeRate.toFixed(1)} Honey/sec`;
  }

  workerCountSpan.textContent = String(counts.worker);
  droneCountSpan.textContent = String(counts.drone);
  queenCountSpan.textContent = String(counts.queen);
  totalRateSpan.textContent = totalRate().toFixed(1);
}

function bounce() {
  mainButton.classList.remove("bounce");
  void mainButton.offsetWidth;
  mainButton.classList.add("bounce");
}
function clickOnce() {
  honey += 1;
  render();
  bounce();
}
mainButton.addEventListener("click", clickOnce);
clickHintBtn.addEventListener("click", clickOnce);

let last = performance.now();
function frame(now: number) {
  const dt = (now - last) / 1000;
  last = now;

  honey += totalRate() * dt;
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame((t) => {
  last = t;
  requestAnimationFrame(frame);
});

render();
