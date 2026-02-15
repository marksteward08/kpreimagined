import * as nsfwjs from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

let model = null;

/**
 * Initialize the NSFW model (mobilenet_v2_mid - 224x224 input)
 * @param {string} modelPath - Model path. Defaults to local model at '/nsfw/model.json'
 * @returns {Promise<void>}
 */
export async function initNSFWModel(modelPath = "/nsfw/model.json") {
  if (model) return; // Already loaded

  try {
    await tf.ready();

    // Try to set optimal backend with better fallback handling
    let backend = "cpu"; // default fallback
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (tf.setBackend) {
      try {
        // Force CPU backend on mobile to ensure consistency with PC
        const targetBackend = isMobile ? "cpu" : "webgl";
        await tf.setBackend(targetBackend);
        backend = targetBackend;
        console.log(
          `Using ${backend} backend (forced for ${isMobile ? "Mobile" : "Desktop"})`,
        );
      } catch (e) {
        console.warn(`${backend} backend failed, trying CPU:`, e.message);
        try {
          await tf.setBackend("cpu");
          backend = "cpu";
          console.log("Using CPU backend (fallback)");
        } catch (e2) {
          console.warn("CPU backend also failed:", e2.message);
        }
      }
    }

    // Log device and backend info
    console.log(
      `Device: ${isMobile ? "Mobile" : "Desktop"}, Backend: ${backend}, Platform: ${navigator.platform}`,
    );

    // Load model from local path
    model = await nsfwjs.load(modelPath, { size: 224 });
    console.log("NSFW model loaded successfully from local path:", modelPath);
  } catch (err) {
    console.error("Failed to load NSFW model:", err);
    throw err;
  }
}

/**
 * Check if an image is NSFW/porn
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageElement - The image to classify
 * @param {Function} callback - Callback function that receives the result
 * @returns {Promise<void>}
 */
export async function checkNSFW(imageElement, callback) {
  if (!model) {
    const error = new Error(
      "Model not initialized. Call initNSFWModel() first.",
    );
    console.error(error.message);
    callback({ error: error.message, predictions: null, verdict: null });
    return;
  }

  if (!imageElement) {
    const error = new Error("No image element provided");
    console.error(error.message);
    callback({ error: error.message, predictions: null, verdict: null });
    return;
  }

  try {
    // Get device info for debugging
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const currentBackend = tf.getBackend();

    // Ensure image/video is ready and normalize input by drawing a center-cropped
    // 224x224 canvas. This yields consistent inputs across devices/backends.
    function createInputCanvas(el, size = 224) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      let iw = el.naturalWidth || el.videoWidth || el.width || 0;
      let ih = el.naturalHeight || el.videoHeight || el.height || 0;

      if (!iw || !ih) {
        const rect = el.getBoundingClientRect();
        iw = rect.width || size;
        ih = rect.height || size;
      }

      const ratio = Math.max(size / iw, size / ih);
      const sw = size / ratio;
      const sh = size / ratio;
      const sx = Math.max(0, (iw - sw) / 2);
      const sy = Math.max(0, (ih - sh) / 2);

      ctx.drawImage(el, sx, sy, sw, sh, 0, 0, size, size);
      return canvas;
    }

    // Wait for the media element to be ready (images/videos)
    if (imageElement.tagName === "IMG") {
      if (!imageElement.complete) {
        await new Promise((res, rej) => {
          imageElement.onload = () => res();
          imageElement.onerror = () => rej(new Error("Image failed to load"));
        });
      }
    } else if (imageElement.tagName === "VIDEO") {
      if (imageElement.readyState < 2) {
        await new Promise((res) => {
          imageElement.onloadeddata = () => res();
        });
      }
    }

    const inputCanvas = createInputCanvas(imageElement, 224);
    console.log(
      `[${isMobile ? "Mobile" : "Desktop"}] Using normalized canvas input`,
      inputCanvas.width,
      inputCanvas.height,
    );

    // Debug: Log canvas image data to verify preprocessing
    const ctx = inputCanvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const avgPixelValue =
      imageData.data.reduce(
        (sum, val, i) => (i % 4 !== 3 ? sum + val : sum),
        0,
      ) /
      (224 * 224 * 3); // Skip alpha channel
    console.log(
      `[${isMobile ? "Mobile" : "Desktop"}] Canvas preprocessed - avg pixel value: ${avgPixelValue.toFixed(2)}`,
    );

    // Classify the normalized canvas to ensure consistent input on all devices
    const predictions = await model.classify(inputCanvas);

    // Log raw predictions for debugging
    console.log(
      `[${isMobile ? "Mobile" : "Desktop"}][${currentBackend}] Raw predictions:`,
      predictions.map((p) => `${p.className}: ${p.probability.toFixed(4)}`),
    );

    // Extract probabilities
    const pornProb =
      predictions.find((p) => p.className === "Porn")?.probability || 0;
    const hentaiProb =
      predictions.find((p) => p.className === "Hentai")?.probability || 0;
    const sexyProb =
      predictions.find((p) => p.className === "Sexy")?.probability || 0;
    const drawingProb =
      predictions.find((p) => p.className === "Drawing")?.probability || 0;
    const neutralProb =
      predictions.find((p) => p.className === "Neutral")?.probability || 0;

    // Calculate combined score
    // if sexy > porn, do not add to explicit score
    const explicitScore =
      pornProb +
      (hentaiProb > 0.25 ? hentaiProb + drawingProb : 0) +
      (sexyProb > pornProb ? 0 : sexyProb);

    // Log calculation details
    console.log(`[${isMobile ? "Mobile" : "Desktop"}] Score calculation:`, {
      pornProb: pornProb.toFixed(4),
      hentaiProb: hentaiProb.toFixed(4),
      sexyProb: sexyProb.toFixed(4),
      drawingProb: drawingProb.toFixed(4),
      explicitScore: explicitScore.toFixed(4),
      total: explicitScore,
    });

    // Determine verdict - make it more robust against edge cases
    // isMobile ? 0.9 : 0.92
    const threshold = 0.9; // Slightly lower threshold for mobile to account for potential backend differences
    const isPorn = explicitScore > threshold;
    const verdict = isPorn ? "Porn" : "Not porn";

    console.log(
      `[${isMobile ? "Mobile" : "Desktop"}] Verdict: ${verdict} (explicitScore: ${explicitScore.toFixed(4)} > ${threshold})`,
    );

    // Prepare result with additional debug info
    const result = {
      error: null,
      predictions,
      verdict,
      isPorn,
      scores: {
        porn: pornProb,
        hentai: hentaiProb,
        explicit: explicitScore,
      },
      debug: {
        device: isMobile ? "Mobile" : "Desktop",
        backend: currentBackend,
        platform: navigator.platform,
        threshold: threshold,
        userAgent: navigator.userAgent,
      },
    };

    // Log result
    console.log(
      `[${isMobile ? "Mobile" : "Desktop"}] NSFW Check Final Result:`,
      result,
    );

    // Call the callback with the result
    callback(result);
  } catch (err) {
    console.error("Error during NSFW classification:", err);
    callback({
      error: String(err),
      predictions: null,
      verdict: null,
      isPorn: null,
    });
  }
}
// Pre-requisites before using checkNSFW:
// 1. Call initNSFWModel() once to load the model before any classification. Put this in a useEffect or similar initialization code.
// The model will now load from the local /nsfw/model.json by default
// let mounted = true;
// (async () => {
//   try {
//     await initNSFWModel(); // Uses local model by default
//     if (mounted) setLoadingModel(false);
//   } catch (err) {
//     console.error("Failed loading model", err);
//     if (mounted) setLoadingModel(false);
//   }
// })();
// return () => {
//   mounted = false;
// };
// 2. useRef to get a reference to the image element you want to classify, and pass that to checkNSFW when calling it. For example:
// const imgRef = useRef(null);
// ...
// <img ref={imgRef} src={imageSrc} />
// ...
// await checkNSFW(imgRef.current, (result) => {
// handle result
// });
