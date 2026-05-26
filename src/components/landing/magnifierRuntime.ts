const MAGNIFIER_ROOT_SELECTOR = "[data-card-magnifier-runtime]";
const MAGNIFIER_IMAGE_SELECTOR = ".showing-card-magnifier";
const ACTIVE_MAGNIFIER_INSET = 5;
const INACTIVE_MAGNIFIER_INSET = 9;

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const readPositiveNumber = (value: string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const readOptionalZoomFactor = (tilt: HTMLElement) => {
  const parsed = Number(window.getComputedStyle(tilt).getPropertyValue("--magnifier-scale"));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const readOptionalLensRadius = (tilt: HTMLElement) => {
  const parsed = Number(window.getComputedStyle(tilt).getPropertyValue("--magnifier-lens-radius").replace("%", ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
};

const readOptionalLensSize = (tilt: HTMLElement) =>
  window.getComputedStyle(tilt).getPropertyValue("--magnifier-lens-size").trim();

const resolveRenderedSourceSize = (sourceSize: number, targetSize: number, zoomFactor: number) =>
  Math.max(targetSize, Math.min(sourceSize, sourceSize * zoomFactor));

const readMagnifierSourceSize = (magnifier: HTMLImageElement) => {
  const declaredWidth = readPositiveNumber(magnifier.dataset.magnifiedWidth) || readPositiveNumber(magnifier.getAttribute("width"));
  const declaredHeight = readPositiveNumber(magnifier.dataset.magnifiedHeight) || readPositiveNumber(magnifier.getAttribute("height"));

  return {
    width: magnifier.naturalWidth || declaredWidth,
    height: magnifier.naturalHeight || declaredHeight,
  };
};

const positionNativeMagnifier = (tilt: HTMLElement, magnifier: HTMLImageElement, pointerX: number, pointerY: number) => {
  const rect = tilt.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const source = readMagnifierSourceSize(magnifier);
  if (source.width <= 0 || source.height <= 0) return;

  const zoomFactor = readOptionalZoomFactor(tilt);
  const renderedWidth = resolveRenderedSourceSize(source.width, rect.width, zoomFactor);
  const renderedHeight = resolveRenderedSourceSize(source.height, rect.height, zoomFactor);
  const pointerRatioX = pointerX / 100;
  const pointerRatioY = pointerY / 100;
  const cursorX = rect.width * pointerRatioX;
  const cursorY = rect.height * pointerRatioY;
  const left = Math.min(0, Math.max(rect.width - renderedWidth, cursorX - renderedWidth * pointerRatioX));
  const top = Math.min(0, Math.max(rect.height - renderedHeight, cursorY - renderedHeight * pointerRatioY));
  const explicitLensSize = readOptionalLensSize(tilt);
  const lensRadius = explicitLensSize === "" ? (Math.min(rect.width, rect.height) * readOptionalLensRadius(tilt)) / 100 : 0;

  magnifier.style.setProperty("--magnifier-source-width", `${renderedWidth.toFixed(2)}px`);
  magnifier.style.setProperty("--magnifier-source-height", `${renderedHeight.toFixed(2)}px`);
  magnifier.style.setProperty("--magnifier-object-x", `${left.toFixed(2)}px`);
  magnifier.style.setProperty("--magnifier-object-y", `${top.toFixed(2)}px`);
  magnifier.style.setProperty("--magnifier-lens-x", `${(cursorX - left).toFixed(2)}px`);
  magnifier.style.setProperty("--magnifier-lens-y", `${(cursorY - top).toFixed(2)}px`);
  if (explicitLensSize === "") {
    magnifier.style.setProperty("--magnifier-lens-size", `${lensRadius.toFixed(2)}px`);
  } else {
    magnifier.style.removeProperty("--magnifier-lens-size");
  }
};

const canUsePointerMagnifier = () =>
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
  window.matchMedia("(hover: hover)").matches &&
  window.matchMedia("(pointer: fine)").matches;

const setMagnifierState = (tilt: HTMLElement, active: boolean) => {
  tilt.dataset.magnifying = String(active);
};

const resolveStableMagnifierState = (tilt: HTMLElement, pointerX: number, pointerY: number) => {
  const inset = tilt.dataset.magnifying === "true" ? ACTIVE_MAGNIFIER_INSET : INACTIVE_MAGNIFIER_INSET;
  return pointerX >= inset && pointerX <= 100 - inset && pointerY >= inset && pointerY <= 100 - inset;
};

const installPointerMagnifier = (tilt: HTMLElement) => {
  if (tilt.dataset.cardMagnifierRuntimeBound === "true") return;
  tilt.dataset.cardMagnifierRuntimeBound = "true";

  if (!canUsePointerMagnifier()) return;

  const magnifier = tilt.querySelector(MAGNIFIER_IMAGE_SELECTOR);
  if (!(magnifier instanceof HTMLImageElement)) return;

  let frame = 0;
  let pointerX = 50;
  let pointerY = 50;
  let isPointerInside = false;

  const applyTilt = () => {
    const rotateY = (pointerX - 50) * 0.16;
    const rotateX = (50 - pointerY) * 0.14;
    tilt.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    tilt.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    tilt.style.setProperty("--glare-x", `${pointerX.toFixed(2)}%`);
    tilt.style.setProperty("--glare-y", `${pointerY.toFixed(2)}%`);
    positionNativeMagnifier(tilt, magnifier, pointerX, pointerY);
    frame = 0;
  };

  tilt.addEventListener(
    "pointerenter",
    () => {
      isPointerInside = true;
    },
    { passive: true },
  );

  tilt.addEventListener(
    "pointermove",
    (event) => {
      const rect = tilt.getBoundingClientRect();
      pointerX = clampPercent(((event.clientX - rect.left) / rect.width) * 100);
      pointerY = clampPercent(((event.clientY - rect.top) / rect.height) * 100);
      setMagnifierState(tilt, isPointerInside && resolveStableMagnifierState(tilt, pointerX, pointerY));
      if (frame === 0) frame = window.requestAnimationFrame(applyTilt);
    },
    { passive: true },
  );

  tilt.addEventListener("pointerleave", () => {
    isPointerInside = false;
    setMagnifierState(tilt, false);
    tilt.style.setProperty("--tilt-x", "0deg");
    tilt.style.setProperty("--tilt-y", "0deg");
    tilt.style.setProperty("--glare-x", "50%");
    tilt.style.setProperty("--glare-y", "18%");
  });
};

export const installCardMagnifierRuntime = (root: ParentNode = document) => {
  root.querySelectorAll(MAGNIFIER_ROOT_SELECTOR).forEach((tilt) => {
    if (tilt instanceof HTMLElement) installPointerMagnifier(tilt);
  });
};
