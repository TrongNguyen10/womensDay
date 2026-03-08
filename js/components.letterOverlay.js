import { CONFIG } from "./config.js";
import { createElement, typeLinesSequentially } from "./helpers.js";

export function createLetterOverlay({ onClose, onContinue }) {
  const overlay = createElement("div", {
    className: "letter-overlay backdrop-hidden hidden",
  });

  const card = createElement("article", { className: "letter-card" });

  const closeBtn = createElement("button", {
    className: "letter-close",
    text: "✕",
    attrs: { type: "button", "aria-label": "Đóng thư" },
  });

  const titleEl = createElement("h2", {
    className: "letter-title",
  });
  const titleIcon = createElement("span", {
    className: "letter-title-icon",
    text: "🌹",
  });
  const titleTextEl = createElement("span", {
    className: "letter-title-text",
  });
  titleEl.append(titleIcon, titleTextEl);

  const bodyEl = createElement("p", {
    className: "letter-body",
  });

  const signWrap = createElement("div", { className: "letter-sign" });
  const signName = createElement("span", {
    className: "letter-sign-name",
  });
  signWrap.append(signName);

  const actions = createElement("div", { className: "letter-actions" });
  const continueBtn = createElement("button", {
    className: "btn-primary is-disabled",
    text: "Tiếp tục",
    attrs: { type: "button", disabled: "true" },
  });
  actions.appendChild(continueBtn);

  card.append(closeBtn, titleEl, bodyEl, signWrap, actions);
  overlay.appendChild(card);

  let hasTyped = false;
  let typingPromise = null;

  closeBtn.addEventListener("click", () => {
    hide();
    if (typeof onClose === "function") {
      onClose();
    }
  });

  continueBtn.addEventListener("click", () => {
    if (continueBtn.classList.contains("is-disabled")) return;
    hide();
    if (typeof onContinue === "function") {
      onContinue();
    }
  });

  async function startTyping() {
    if (hasTyped) return;
    hasTyped = true;

    titleTextEl.textContent = "";
    signName.textContent = "";
    bodyEl.textContent = "";

    const lines = [
      { element: titleTextEl, text: CONFIG.letter.title },
      { element: bodyEl, text: CONFIG.letter.body },
      { element: signName, text: `${CONFIG.letter.signatureName} 💕` },
    ];

    typingPromise = typeLinesSequentially(lines, {
      speed: CONFIG.typing.charSpeed,
      linePause: CONFIG.typing.linePause,
      onLineStart: (index) => {
        if (index === 0) {
          titleTextEl.classList.add("typing-caret");
        }
        if (index === 2) {
          signName.classList.add("typing-caret");
        }
      },
      onLineEnd: (index) => {
        if (index === 0) {
          titleTextEl.classList.remove("typing-caret");
        }
        if (index === 2) {
          signName.classList.remove("typing-caret");
        }
      },
    });

    await typingPromise;

    continueBtn.classList.remove("is-disabled");
    continueBtn.removeAttribute("disabled");
  }

  function show() {
    overlay.classList.remove("hidden");
    requestAnimationFrame(() => {
      overlay.classList.remove("backdrop-hidden");
      card.classList.add("is-visible");
    });
  }

  function hide() {
    card.classList.remove("is-visible");
    overlay.classList.add("backdrop-hidden");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 400);
  }

  async function showAndType() {
    show();
    await startTyping();
  }

  return {
    element: overlay,
    show,
    hide,
    showAndType,
  };
}

