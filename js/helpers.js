export const qs = (selector, root = document) => root.querySelector(selector);

export function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  const { className, text, html, attrs, dataset } = options;

  if (className) {
    el.className = className;
  }
  if (text != null) {
    el.textContent = text;
  }
  if (html != null) {
    el.innerHTML = html;
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value != null) el.setAttribute(key, value);
    });
  }
  if (dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
      el.dataset[key] = value;
    });
  }

  return el;
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gõ chữ từng ký tự cho 1 element.
 * Trả về Promise resolve khi gõ xong.
 */
export async function typeText(target, fullText, options = {}) {
  const { speed = 45 } = options;
  target.textContent = "";

  for (let i = 0; i < fullText.length; i += 1) {
    target.textContent += fullText[i];
    // nhỏ delay cho khoảng trắng để cảm giác mượt hơn
    const base = fullText[i] === " " ? speed * 0.3 : speed;
    // thêm chút randomness
    const jitter = Math.random() * (speed * 0.3);
    // eslint-disable-next-line no-await-in-loop
    await wait(base * 0.7 + jitter);
  }
}

/**
 * Gõ nhiều dòng lần lượt.
 * lines: [{ element, text }]
 */
export async function typeLinesSequentially(lines, options = {}) {
  const {
    speed,
    linePause = 500,
    onLineStart,
    onLineEnd,
  } = options;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || !line.element) continue;

    if (typeof onLineStart === "function") {
      onLineStart(index, line);
    }

    // eslint-disable-next-line no-await-in-loop
    await typeText(line.element, line.text, { speed });

    if (typeof onLineEnd === "function") {
      onLineEnd(index, line);
    }

    // eslint-disable-next-line no-await-in-loop
    await wait(linePause);
  }
}


