import { CONFIG } from "./config.js";
import { createElement } from "./helpers.js";

function createSkyLayer() {
  const layer = createElement("div", { className: "sky-layer" });
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const flakeCount = isMobile
    ? Math.max(20, Math.round(CONFIG.snow.flakes * 0.6))
    : CONFIG.snow.flakes;
  const shootingCount = isMobile
    ? Math.max(1, CONFIG.snow.shootingStars - 1)
    : CONFIG.snow.shootingStars;

  // Snow flakes
  for (let i = 0; i < flakeCount; i += 1) {
    const flake = createElement("span", { className: "snowflake" });
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = 8 + Math.random() * 10;
    const drift = (Math.random() - 0.5) * 60;

    flake.style.left = `${left}%`;
    flake.style.animationDelay = `${delay}s`;
    flake.style.animationDuration = `${duration}s`;
    flake.style.setProperty("--drift-x", `${drift}px`);
    layer.appendChild(flake);
  }

  // Shooting stars
  for (let i = 0; i < shootingCount; i += 1) {
    const star = createElement("span", { className: "shooting-star" });
    const delay = Math.random() * 8;
    const top = Math.random() * 40;

    star.style.top = `${top}%`;
    star.style.animationDelay = `${delay}s`;
    layer.appendChild(star);
  }

  return layer;
}

function createMeadow() {
  const meadow = createElement("div", { className: "meadow" });
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const bladesCount = isMobile ? 80 : 120;
  const flowersCount = isMobile ? 16 : 22;

  const grassLayer = createElement("div", { className: "meadow-grass" });
  for (let i = 0; i < bladesCount; i += 1) {
    const blade = createElement("span", { className: "meadow-grass-blade" });
    const left = Math.random() * 100;
    const height = 16 + Math.random() * 34;
    const width = 1 + Math.random() * 2.2;
    blade.style.left = `${left}%`;
    blade.style.height = `${height}px`;
    blade.style.width = `${width}px`;
    blade.style.opacity = `${0.35 + Math.random() * 0.55}`;
    blade.style.animationDelay = `${Math.random() * 2.2}s`;
    grassLayer.appendChild(blade);
  }

  const flowersLayer = createElement("div", { className: "meadow-flowers" });
  const flowerEmojis = ["🌸", "🌷", "🌼", "🌺", "🍀"];
  for (let i = 0; i < flowersCount; i += 1) {
    const flower = createElement("span", {
      className: "meadow-flower",
      text: flowerEmojis[i % flowerEmojis.length],
    });
    const left = 2 + Math.random() * 96;
    flower.style.left = `${left}%`;
    flower.style.animationDelay = `${Math.random() * 2.5}s`;
    flower.style.fontSize = `${0.9 + Math.random() * 0.8}rem`;
    flowersLayer.appendChild(flower);
  }

  const flyersLayer = createElement("div", { className: "meadow-flyers" });
  const bees = [
    createElement("span", { className: "meadow-bee meadow-bee--left", text: "🐝" }),
    createElement("span", { className: "meadow-bee meadow-bee--mid", text: "🐝" }),
    createElement("span", { className: "meadow-bee meadow-bee--right", text: "🐝" }),
  ];
  const butterflies = [
    createElement("span", {
      className: "meadow-butterfly meadow-butterfly--left",
      text: "🦋",
    }),
    createElement("span", {
      className: "meadow-butterfly meadow-butterfly--right",
      text: "🦋",
    }),
  ];
  flyersLayer.append(...bees, ...butterflies);

  const bunnyLeft = createElement("div", {
    className: "bunny bunny--left",
    text: "🐰",
  });
  const bunnyRight = createElement("div", {
    className: "bunny bunny--right",
    text: "🐰",
  });

  meadow.append(grassLayer, flowersLayer, flyersLayer, bunnyLeft, bunnyRight);
  return meadow;
}

export function createMainScene({ onCardClick }) {
  const scene = createElement("section", {
    className: "scene scene-main hidden",
  });

  const hills = createElement("div", { className: "scene-hills" });
  const meadow = createMeadow();
  const skyLayer = createSkyLayer();

  const title = createElement("h1", {
    className: "scene-title",
    text: CONFIG.scene.title,
  });

  const centerpiece = createElement("div", { className: "scene-centerpiece" });
  const bouquetWrap = createElement("div", { className: "bouquet-wrapper" });

  const bouquetImg = createElement("img", {
    className: "bouquet-img",
    attrs: {
      src: "./assets/photos/bouquet1.png",
      alt: "Bouquet",
    },
  });

  const cardButton = createElement("button", {
    className: "gift-card",
  });
  const cardLabel = createElement("span", {
    className: "gift-card-label",
    text: "Nhấn vào tấm thiệp nhé",
  });
  cardButton.appendChild(cardLabel);
  cardButton.addEventListener("click", () => {
    if (typeof onCardClick === "function") {
      onCardClick();
    }
  });

  bouquetWrap.append(bouquetImg, cardButton);

  const musicIndicator = createElement("div", {
    className: "music-indicator",
  });
  musicIndicator.innerHTML = `
    <span class="music-indicator-dot"></span>
    <span class="music-indicator-label">Nhạc đang phát</span>
  `;

  centerpiece.appendChild(bouquetWrap);
  scene.append(
    skyLayer,
    hills,
    meadow,
    title,
    centerpiece,
    musicIndicator,
  );

  function activate() {
    scene.classList.remove("hidden");
    // bật nền trời đêm
    document.body.classList.add("is-night");

    requestAnimationFrame(() => {
      scene.classList.add("is-active");
      title.classList.add("is-visible");
      bouquetImg.classList.add("is-visible");
      cardButton.classList.add("is-visible");
    });
  }

  function setMusicPlaying(playing) {
    if (playing) {
      musicIndicator.classList.remove("paused");
      musicIndicator.querySelector(".music-indicator-label").textContent =
        "Nhạc đang phát";
    } else {
      musicIndicator.classList.add("paused");
      musicIndicator.querySelector(".music-indicator-label").textContent =
        "Nhạc tạm dừng";
    }
  }

  return {
    element: scene,
    activate,
    setMusicPlaying,
  };
}

