import { CONFIG } from "./config.js";
import { qs } from "./helpers.js";
import { createIntroScreen } from "./components.intro.js";
import { createMainScene } from "./components.sceneMain.js";
import { createLetterOverlay } from "./components.letterOverlay.js";
import { createPhotoRain } from "./components.photoRain.js";
import { createPhotoViewer } from "./components.photoViewer.js";

function getAudioElement() {
  const el = qs(`#${CONFIG.audio.elementId}`);
  if (!el) return null;
  el.volume = CONFIG.audio.volume;
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  const root = qs("#app");
  if (!root) return;

  const audio = getAudioElement();

  const photoViewer = createPhotoViewer();
  const photoRain = createPhotoRain({
    onPhotoClick: (photo) => {
      photoViewer.show(photo);
    },
  });
  const mainScene = createMainScene({
    onCardClick: () => {
      letter.showAndType();
    },
  });
  const letter = createLetterOverlay({
    onClose: () => {},
    onContinue: () => {
      photoRain.start();
    },
  });
  const intro = createIntroScreen({
    onStart: () => {
      intro.classList.add("fade-out");
      setTimeout(() => {
        intro.remove();
      }, 300);

      mainScene.activate();
      if (audio) {
        audio
          .play()
          .then(() => {
            mainScene.setMusicPlaying(true);
          })
          .catch(() => {
            mainScene.setMusicPlaying(false);
          });

        audio.addEventListener("play", () => mainScene.setMusicPlaying(true));
        audio.addEventListener("pause", () => mainScene.setMusicPlaying(false));
      }
    },
  });

  root.append(
    intro,
    mainScene.element,
    photoRain.container,
    letter.element,
    photoViewer.element,
  );
});

