import beeImage from "./beebee.webp";
import honeycombImage from "./honeycomb.png";
import "./style.css";

//data and types setup

interface ItemDef {
  key: ItemKey;
  name: string;
  baseCost: number;
  rate: number;
  description: string;
}

const PRICE_SCALE = 1.15;

const availableItems: ItemDef[] = [
  {
    key: "worker",
    name: "Hire Worker Bee",
    baseCost: 10,
    rate: 0.1,
    description: "Foragers that bring in a trickle of nectar.",
  },
  {
    key: "drone",
    name: "Hire Drone Bee",
    baseCost: 100,
    rate: 2.0,
    description: "Big buzz, steady honey throughout.",
  },
  {
    key: "queen",
    name: "Hire Queen Bee",
    baseCost: 1000,
    rate: 50.0,
    description: "Royal production line. Long live the queen!",
  },
  {
    key: "frame",
    name: "Add Hive Frame",
    baseCost: 10_000,
    rate: 1000.0,
    description: "A fresh frame full of comb—storage and flow boost.",
  },
  {
    key: "box",
    name: "Install Bee Box",
    baseCost: 100_000,
    rate: 12_000.0,
    description: "A new box added to the coloney. Honey river time.",
  },
];

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

const buttons = {} as Record<ItemKey, HTMLButtonElement>;
for (const def of availableItems) {
  const itemButton = document.createElement("button");
  itemButton.style.padding = "8px 14px";
  itemButton.style.fontSize = "14px";
  itemButton.style.backgroundColor = "#f6de6d";
  itemButton.style.color = "#000";
  itemButton.style.border = "none";
  itemButton.style.borderRadius = "10px";
  itemButton.style.cursor = "pointer";
  itemButton.disabled = true;
  itemButton.title = def.description;

  itemButton.addEventListener("click", () => {
    const cost = currentCost(def);
    if (honey + 1e-9 >= cost) {
      honey -= cost;
      counts[def.key] += 1;
      render();
    }
  });

  buttons[def.key] = itemButton;
  shop.append(itemButton);
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

function clickOnce() {
  honey += 1;
  render();
  bounce();
}

//rendering

function render() {
  counterDiv.textContent = `Honey Gathered: ${honey.toFixed(1)}`;

  for (const def of availableItems) {
    const itemButton = buttons[def.key];
    const cost = currentCost(def);
    const owned = counts[def.key];
    const perTypeRate = owned * def.rate;

    itemButton.disabled = honey + 1e-9 < cost;
    itemButton.style.opacity = itemButton.disabled ? "0.7" : "1";
    itemButton.style.cursor = itemButton.disabled ? "not-allowed" : "pointer";
    itemButton.textContent =
      `${def.name} (+${def.rate.toFixed(1)}/sec) — Cost: ${
        cost.toFixed(1)
      } — ` +
      `Owned: ${owned} — Rate: ${perTypeRate.toFixed(1)} Honey/sec`;
  }

  inventorySpan.textContent = availableItems
    .map((d) =>
      `${d.name.replace(/^Hire |Add |Install /, "")}: ${counts[d.key]}`
    )
    .join("  •  ");

  totalRateSpan.textContent = totalRate().toFixed(1);
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
