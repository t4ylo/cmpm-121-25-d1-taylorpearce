import beeImage from "./beebee.webp";
import honeycombImage from "./honeycomb.png";
import queenBee from "./queenbee.webp";
import workerBee from "./wokerbee.webp";
import droneBee from "./dronebee.webp";
import beeFrame from "./Adobe Express - file (2).png";
import beeBox from "./Adobe Express - file (3).png";

import "./style.css";

//data and types setup

interface ItemDef {
  key: ItemKey;
  name: string;
  baseCost: number;
  rate: number;
  description: string;
  image: string; // ⬅️ NEW
}

/*this is the code for the upgrade images which is inspired by https://github.com/wendyzh05/D1 */
const availableItems: ItemDef[] = [
  {
    key: "worker",
    name: "Hire Worker Bee",
    baseCost: 10,
    rate: 0.1,
    description: "Foragers that bring in a trickle of nectar.",
    image: workerBee, // ⬅️
  },
  {
    key: "drone",
    name: "Hire Drone Bee",
    baseCost: 100,
    rate: 2.0,
    description: "Big buzz, steady honey throughout.",
    image: droneBee, // ⬅️
  },
  {
    key: "queen",
    name: "Hire Queen Bee",
    baseCost: 1000,
    rate: 50.0,
    description: "Royal production line. Long live the queen!",
    image: queenBee, // ⬅️
  },
  {
    key: "frame",
    name: "Add Hive Frame",
    baseCost: 10_000,
    rate: 1000.0,
    description: "A fresh frame full of comb—storage and flow boost.",
    image: beeFrame, // ⬅️
  },
  {
    key: "box",
    name: "Install Bee Box",
    baseCost: 100_000,
    rate: 12_000.0,
    description: "A new box added to the coloney. Honey river time.",
    image: beeBox, // ⬅️
  },
];

const PRICE_SCALE = 1.15;

//DOM elements

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

const inventorySpan = document.createElement("span");
const totalRateSpan = document.createElement("span");
statsDiv.append(
  inventorySpan,
  document.createTextNode("  •  Total rate: "),
  totalRateSpan,
  document.createTextNode(" Honey/sec"),
);

//images and style

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

const clickHintitemButton = document.createElement("button");
clickHintitemButton.textContent =
  "🐝 Tap the Honeycomb to Help Your Bee Gather Honey!";
clickHintitemButton.style.position = "absolute";
clickHintitemButton.style.bottom = "40px";
clickHintitemButton.style.left = "50%";
clickHintitemButton.style.transform = "translateX(-50%)";
clickHintitemButton.style.padding = "8px 14px";
clickHintitemButton.style.fontSize = "14px";
clickHintitemButton.style.backgroundColor = "#f6de6d";
clickHintitemButton.style.color = "#000";
clickHintitemButton.style.border = "none";
clickHintitemButton.style.borderRadius = "8px";
clickHintitemButton.style.cursor = "pointer";
clickHintitemButton.style.zIndex = "3";
container.append(clickHintitemButton);

const shop = document.createElement("div");
shop.style.position = "absolute";
shop.style.top = "220px";
shop.style.right = "36px";
shop.style.display = "grid";
shop.style.gap = "16px";
container.append(shop);

//game state

type ItemKey = "worker" | "drone" | "queen" | "frame" | "box";

let honey = 0;
const counts = {
  worker: 0,
  drone: 0,
  queen: 0,
  frame: 0,
  box: 0,
} as Record<ItemKey, number>;

/*this is the code for the upgrade images which is inspired by https://github.com/wendyzh05/D1 */
type ButtonRefs = { button: HTMLButtonElement; label: HTMLSpanElement };
const buttons: Record<ItemKey, ButtonRefs> = {} as Record<ItemKey, ButtonRefs>;

for (const def of availableItems) {
  const button = document.createElement("button") as HTMLButtonElement;
  button.className = "upgrade-button";
  button.title = def.description;
  button.disabled = true;

  const img = document.createElement("img");
  img.src = def.image;
  img.alt = def.name;
  img.className = "upgrade-img";

  const label = document.createElement("span");
  label.className = "upgrade-label";
  label.textContent = def.name;

  button.append(img, label);

  button.addEventListener("click", () => {
    const cost = currentCost(def);
    if (honey + 1e-9 >= cost) {
      honey -= cost;
      counts[def.key] += 1;
      render();
    }
  });

  buttons[def.key] = { button, label };
  shop.append(button);
}

function currentCost(def: ItemDef): number {
  return def.baseCost * Math.pow(PRICE_SCALE, counts[def.key]);
}

function totalRate(): number {
  return availableItems.reduce((sum, d) => sum + counts[d.key] * d.rate, 0);
}

function bounce() {
  mainButton.classList.remove("bounce");
  void mainButton.offsetWidth;
  mainButton.classList.add("bounce");
}

/*this is the function for the number pop up which is inspired by https://github.com/inyoo403/D1.a */
function showFloatingText(amount: number, x: number, y: number) {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = `+${amount.toFixed(1)}`;
  const rect = container.getBoundingClientRect();
  el.style.left = `${x - rect.left}px`;
  el.style.top = `${y - rect.top}px`;
  container.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function clickOnce(ev?: MouseEvent) {
  honey += 1;
  render();
  bounce();

  const rect = mainButton.getBoundingClientRect();
  const x = ev?.clientX ?? rect.left + Math.random() * rect.width;
  const y = ev?.clientY ?? rect.top + Math.random() * rect.height;

  showFloatingText(1, x, y);
}

//rendering

function render() {
  counterDiv.textContent = `Honey Gathered: ${honey.toFixed(1)}`;

  inventorySpan.textContent = availableItems
    .map((d) =>
      `${d.name.replace(/^Hire |Add |Install /, "")}: ${counts[d.key]}`
    )
    .join("  •  ");

  totalRateSpan.textContent = totalRate().toFixed(1);

  /*this is the code for the upgrade images which is inspired by https://github.com/wendyzh05/D1 */
  for (const def of availableItems) {
    const { button, label } = buttons[def.key];
    const cost = currentCost(def);
    const owned = counts[def.key];
    const perTypeRate = owned * def.rate;

    button.disabled = honey + 1e-9 < cost;
    button.style.opacity = button.disabled ? "0.7" : "1";
    button.style.cursor = button.disabled ? "not-allowed" : "pointer";

    label.textContent =
      `${def.name} (+${def.rate.toFixed(1)}/sec) — Cost: ${
        cost.toFixed(1)
      } — ` +
      `Owned: ${owned} — Rate: ${perTypeRate.toFixed(1)}/sec`;
  }
}

mainButton.addEventListener("click", clickOnce);
clickHintitemButton.addEventListener("click", clickOnce);

//game loop

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
