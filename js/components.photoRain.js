import { CONFIG } from "./config.js";
import { createElement } from "./helpers.js";

function attachDraggable(wrapper, img, onPhotoClick, src) {
  let isDragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let originLeft = 0;
  let originTop = 0;
  let hasLockedPosition = false;

  const getPoint = (event) => {
    if (event.touches && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return { x: event.clientX, y: event.clientY };
  };

  const handleDown = (event) => {
    const { x, y } = getPoint(event);
    isDragging = true;
    moved = false;
    hasLockedPosition = false;

    const rect = wrapper.getBoundingClientRect();
    const containerRect = wrapper.parentElement.getBoundingClientRect();

    startX = x;
    startY = y;
    originLeft = rect.left - containerRect.left;
    originTop = rect.top - containerRect.top;
  };

  const handleMove = (event) => {
    if (!isDragging) return;
    const { x, y } = getPoint(event);
    const dx = x - startX;
    const dy = y - startY;

    const distance = Math.abs(dx) + Math.abs(dy);
    if (!hasLockedPosition && distance > 4) {
      hasLockedPosition = true;
      moved = true;
      startLeft = originLeft;
      startTop = originTop;
      wrapper.style.left = `${startLeft}px`;
      wrapper.style.top = `${startTop}px`;
      wrapper.style.bottom = "auto";
      wrapper.classList.add("is-dragging");
      if (event.cancelable) {
        event.preventDefault();
      }
    }

    if (!hasLockedPosition) return;

    const nextLeft = startLeft + dx;
    const nextTop = startTop + dy;

    wrapper.style.left = `${nextLeft}px`;
    wrapper.style.top = `${nextTop}px`;
  };

  const handleUp = () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove("is-dragging");
    hasLockedPosition = false;
  };

  wrapper.addEventListener("mousedown", handleDown);
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);

  wrapper.addEventListener(
    "touchstart",
    (event) => {
      handleDown(event);
    },
    { passive: false },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;
      handleMove(event);
    },
    { passive: false },
  );

  window.addEventListener("touchend", handleUp);
  window.addEventListener("touchcancel", handleUp);

  if (typeof onPhotoClick === "function") {
    img.addEventListener("click", (event) => {
      if (moved) return;
      event.stopPropagation();
      onPhotoClick({ src, alt: img.alt });
    });
  }
}

export function createPhotoRain({ onPhotoClick } = {}) {
  const container = createElement("div", {
    className: "photo-rain hidden",
  });

  const sources = CONFIG.photos.sources.length
    ? CONFIG.photos.sources
    : ["./assets/photos/sample1.jpg"];

  const total = CONFIG.photos.count;

  for (let i = 0; i < total; i += 1) {
    const src = sources[i % sources.length];
    const wrapper = createElement("div", { className: "memory-photo" });
    const img = createElement("img", {
      attrs: {
        src,
        alt: "Kỉ niệm dễ thương",
      },
    });

    const left = 6 + Math.random() * 78;
    const delay = Math.random() * 4;
    const duration = 12 + Math.random() * 10;
    const tilt = -20 + Math.random() * 40;

    wrapper.style.left = `${left}%`;
    wrapper.style.animationDelay = `${delay}s`;
    wrapper.style.animationDuration = `${duration}s`;
    wrapper.style.setProperty("--tilt", `${tilt}deg`);

    // một vài tấm hơi nghiêng mạnh hơn
    if (Math.random() > 0.7) {
      wrapper.style.transformOrigin = "50% 120%";
    }

    wrapper.appendChild(img);
    attachDraggable(wrapper, img, onPhotoClick, src);
    container.appendChild(wrapper);
  }

  function start() {
    container.classList.remove("hidden");
  }

  function stop() {
    container.classList.add("hidden");
  }

  return {
    container,
    start,
    stop,
  };
}

