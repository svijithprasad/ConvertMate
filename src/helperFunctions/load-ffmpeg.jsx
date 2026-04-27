// imports
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CDN_OPTIONS = [
  "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm",
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.2/dist/esm",
];

export default async function loadFfmpeg() {
  const ffmpeg = new FFmpeg();
  let lastError = null;

  for (const baseURL of CDN_OPTIONS) {
    try {
      console.log(`Loading FFmpeg from: ${baseURL}`);
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      console.log("FFmpeg loaded successfully");
      return ffmpeg;
    } catch (error) {
      console.warn(`Failed to load from ${baseURL}:`, error);
      lastError = error;
      // Continue to next CDN option
    }
  }

  // If all CDNs fail, throw the last error
  throw new Error(
    `Failed to load FFmpeg from all CDN options. Last error: ${lastError?.message || "Unknown error"}`
  );
}
