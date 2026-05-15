import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const A4_PREVIEW_WIDTH_PX = 794;
export const A4_PREVIEW_HEIGHT_PX = 1123;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const parseOklchNumber = (value: string, isLightness = false) => {
  const cleanValue = value.trim();
  const parsedValue = Number.parseFloat(cleanValue);

  if (Number.isNaN(parsedValue)) return 0;
  if (cleanValue.endsWith("%")) return parsedValue / 100;

  return isLightness && parsedValue > 1 ? parsedValue / 100 : parsedValue;
};

const linearToSrgb = (value: number) => {
  const clampedValue = clamp(value);
  const srgbValue =
    clampedValue <= 0.0031308
      ? 12.92 * clampedValue
      : 1.055 * clampedValue ** (1 / 2.4) - 0.055;

  return Math.round(clamp(srgbValue) * 255);
};

const oklchToRgb = (oklchValue: string) => {
  const [colorPart, alphaPart] = oklchValue.split("/");
  const [lightnessValue, chromaValue, hueValue = "0"] = colorPart
    .trim()
    .split(/\s+/);

  const lightness = parseOklchNumber(lightnessValue, true);
  const chroma = parseOklchNumber(chromaValue);
  const hue = Number.parseFloat(hueValue) || 0;
  const alpha = alphaPart ? parseOklchNumber(alphaPart) : 1;
  const hueRadians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);

  const lValue = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mValue = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sValue = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lValue ** 3;
  const m = mValue ** 3;
  const s = sValue ** 3;
  const red = linearToSrgb(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  );
  const green = linearToSrgb(
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  );
  const blue = linearToSrgb(
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  );

  return alpha < 1
    ? `rgba(${red}, ${green}, ${blue}, ${clamp(alpha)})`
    : `rgb(${red}, ${green}, ${blue})`;
};

const normalizeColorFunctions = (value: string) =>
  value.replace(/oklch\(([^)]+)\)/g, (_, oklchValue: string) =>
    oklchToRgb(oklchValue)
  );

const colorStyleProperties = [
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "color",
  "outline-color",
  "text-decoration-color",
] as const;

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const waitForFonts = async () => {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
};

const waitForImages = async (rootElement: HTMLElement) => {
  const images = Array.from(rootElement.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => resolve();
        });
      }

      if ("decode" in image) {
        await image.decode().catch(() => undefined);
      }
    })
  );
};

const normalizeCanvasStyles = (rootElement: HTMLElement) => {
  const elements = [
    rootElement,
    ...Array.from(rootElement.querySelectorAll<HTMLElement>("*")),
  ];

  elements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);

    colorStyleProperties.forEach((property) => {
      const value = computedStyle.getPropertyValue(property);

      if (value) {
        element.style.setProperty(property, normalizeColorFunctions(value));
      }
    });

    element.style.setProperty(
      "font-family",
      computedStyle.fontFamily || "Arial, sans-serif"
    );
    element.style.setProperty("letter-spacing", computedStyle.letterSpacing);
    element.style.setProperty("line-height", computedStyle.lineHeight);
    element.style.setProperty("box-shadow", "none");
  });
};

const createPdfClone = (sourceElement: HTMLElement) => {
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  const container = document.createElement("div");

  clone.classList.add("resume-pdf-clone");
  clone.style.width = `${A4_PREVIEW_WIDTH_PX}px`;
  clone.style.minWidth = `${A4_PREVIEW_WIDTH_PX}px`;
  clone.style.maxWidth = `${A4_PREVIEW_WIDTH_PX}px`;
  clone.style.height = "auto";
  clone.style.minHeight = `${A4_PREVIEW_HEIGHT_PX}px`;
  clone.style.backgroundColor = "#ffffff";
  clone.style.transform = "none";

  container.style.position = "fixed";
  container.style.left = "-100000px";
  container.style.top = "0";
  container.style.width = `${A4_PREVIEW_WIDTH_PX}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.pointerEvents = "none";
  container.style.zIndex = "-1";
  container.appendChild(clone);
  document.body.appendChild(container);

  return {
    clone,
    cleanup: () => container.remove(),
  };
};

const addCanvasToPdf = (canvas: HTMLCanvasElement, fileName: string) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageHeightPx = Math.floor(canvas.width * (A4_HEIGHT_MM / A4_WIDTH_MM));
  let renderedHeightPx = 0;
  let pageIndex = 0;

  while (renderedHeightPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedHeightPx);
    const pageCanvas = document.createElement("canvas");
    const pageContext = pageCanvas.getContext("2d");

    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    if (!pageContext) {
      throw new Error("Could not create PDF canvas context.");
    }

    pageContext.fillStyle = "#ffffff";
    pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageContext.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx
    );

    if (pageIndex > 0) {
      pdf.addPage();
    }

    const pageImage = pageCanvas.toDataURL("image/jpeg", 0.98);
    const pageHeightMm = (sliceHeightPx / canvas.width) * A4_WIDTH_MM;

    pdf.addImage(pageImage, "JPEG", 0, 0, A4_WIDTH_MM, pageHeightMm);
    renderedHeightPx += sliceHeightPx;
    pageIndex += 1;
  }

  pdf.save(fileName);
};

export const downloadResumePdf = async (
  sourceElement: HTMLElement,
  fileName: string
) => {
  await waitForFonts();
  await waitForImages(sourceElement);
  await waitForPaint();

  const { clone, cleanup } = createPdfClone(sourceElement);

  try {
    await waitForImages(clone);
    await waitForPaint();
    normalizeCanvasStyles(clone);
    await waitForPaint();

    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      scale: Math.min(window.devicePixelRatio || 2, 2.5),
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: A4_PREVIEW_WIDTH_PX,
      height: Math.ceil(clone.scrollHeight),
      windowWidth: A4_PREVIEW_WIDTH_PX,
      windowHeight: Math.ceil(clone.scrollHeight),
      scrollX: 0,
      scrollY: 0,
    });

    addCanvasToPdf(canvas, fileName);
  } finally {
    cleanup();
  }
};
