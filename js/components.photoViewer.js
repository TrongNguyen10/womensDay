import { createElement } from "./helpers.js";

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

export function createPhotoViewer() {
  const overlay = createElement("div", {
    className: "photo-viewer hidden",
  });

  const backdrop = createElement("div", {
    className: "photo-viewer-backdrop",
  });

  const frame = createElement("div", {
    className: "photo-viewer-frame",
  });

  const closeBtn = createElement("button", {
    className: "photo-viewer-close",
    text: "✕",
    attrs: { type: "button", "aria-label": "Đóng ảnh" },
  });

  const imageWrapper = createElement("div", {
    className: "photo-viewer-image-wrapper",
  });

  const image = createElement("img", {
    className: "photo-viewer-image",
  });

  imageWrapper.append(image);
  frame.append(imageWrapper, closeBtn);
  overlay.append(backdrop, frame);

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let panStartX = 0;
  let panStartY = 0;
  let panStartOffsetX = 0;
  let panStartOffsetY = 0;
  let isPanning = false;

  function getMaxOffset() {
    const w = frame.offsetWidth || 400;
    const h = frame.offsetHeight || 300;
    const maxX = Math.max(0, (scale - 1) * (w / 2));
    const maxY = Math.max(0, (scale - 1) * (h / 2));
    return { maxX, maxY };
  }

  function clampOffset() {
    if (scale <= 1) {
      offsetX = 0;
      offsetY = 0;
      return;
    }
    const { maxX, maxY } = getMaxOffset();
    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
  }

  function applyTransform() {
    imageWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    frame.classList.toggle("photo-viewer-zoomed", scale > 1);
  }

  function setZoom(value) {
    scale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
    if (scale <= 1) {
      offsetX = 0;
      offsetY = 0;
    } else {
      clampOffset();
    }
    applyTransform();
  }

  function setPan(dx, dy) {
    if (scale <= 1) return;
    offsetX = panStartOffsetX + dx;
    offsetY = panStartOffsetY + dy;
    clampOffset();
    applyTransform();
  }

  function resetZoom() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  }

  function hide() {
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    resetZoom();
  }

  function show({ src, alt }) {
    image.src = src;
    image.alt = alt || "Kỉ niệm";
    resetZoom();
    overlay.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  }

  // Đóng khi bấm nút X
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hide();
  });

  // Đóng khi chạm/bấm ra ngoài (backdrop)
  backdrop.addEventListener("click", () => {
    hide();
  });

  // Pan bằng chuột (chỉ khi zoom > 1)
  imageWrapper.addEventListener("mousedown", (e) => {
    if (!imageWrapper.contains(e.target)) return;
    if (scale <= 1) return;
    e.preventDefault();
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartOffsetX = offsetX;
    panStartOffsetY = offsetY;
    frame.classList.add("photo-viewer-panning");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan(e.clientX - panStartX, e.clientY - panStartY);
  });

  window.addEventListener("mouseup", () => {
    if (isPanning) {
      isPanning = false;
      frame.classList.remove("photo-viewer-panning");
    }
  });

  // Pan bằng 1 ngón (touch), zoom bằng 2 ngón (pinch)
  imageWrapper.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        pinchStartDistance = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        pinchStartScale = scale;
      } else if (e.touches.length === 1 && scale > 1) {
        isPanning = true;
        panStartX = e.touches[0].clientX;
        panStartY = e.touches[0].clientY;
        panStartOffsetX = offsetX;
        panStartOffsetY = offsetY;
        frame.classList.add("photo-viewer-panning");
      }
    },
    { passive: true }
  );

  frame.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2 && e.cancelable) {
        e.preventDefault();
        isPanning = false;
        frame.classList.remove("photo-viewer-panning");
        const distance = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY
        );
        const ratio = distance / pinchStartDistance;
        setZoom(pinchStartScale * ratio);
      } else if (e.touches.length === 1 && isPanning && e.cancelable) {
        e.preventDefault();
        setPan(e.touches[0].clientX - panStartX, e.touches[0].clientY - panStartY);
      }
    },
    { passive: false }
  );

  window.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) {
      isPanning = false;
      frame.classList.remove("photo-viewer-panning");
    }
  });

  window.addEventListener("touchcancel", () => {
    isPanning = false;
    frame.classList.remove("photo-viewer-panning");
  });

  // Phóng to/thu nhỏ bằng chuột (wheel)
  frame.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom(scale + ZOOM_STEP);
      } else {
        setZoom(scale - ZOOM_STEP);
      }
    },
    { passive: false }
  );

  // Ngăn click trên frame (ảnh) đóng viewer - chỉ backdrop mới đóng
  frame.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  return {
    element: overlay,
    show,
    hide,
  };
}
