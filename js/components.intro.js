import { CONFIG } from "./config.js";
import { createElement } from "./helpers.js";

export function createIntroScreen({ onStart }) {
  const root = createElement("section", { className: "intro-screen fade-in" });

  const card = createElement("div", { className: "intro-card" });
  const bouquet = createElement("div", { className: "intro-bouquet" });

  // Người dùng có thể thay hình bên trong bằng cách sửa src bên dưới.
  const bouquetImg = createElement("img", {
    attrs: {
      src: "./assets/photos/me.jpg",
      alt: "Bouquet",
    },
  });
  bouquet.appendChild(bouquetImg);

  const question = createElement("div", {
    className: "intro-question",
    text: CONFIG.intro.question,
  });

  const button = createElement("button", {
    className: "intro-btn",
  });
  const icon = createElement("span", {
    className: "icon",
    text: "♫",
  });
  const label = document.createTextNode(CONFIG.intro.buttonLabel);

  button.append(icon, label);
  button.addEventListener("click", () => {
    if (typeof onStart === "function") {
      onStart();
    }
  });

  card.append(bouquet, question, button);
  root.appendChild(card);

  return root;
}

