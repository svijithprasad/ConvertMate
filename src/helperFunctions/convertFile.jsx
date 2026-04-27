import { fetchFile } from "@ffmpeg/util";

function getFileExtension(file_name) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  return ""; // No file extension found
}

function removeFileExtension(file_name) {
  const lastDotIndex = file_name.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

// Comprehensive MIME type mapping
const MIME_TYPES = {
  // Video formats
  mp4: "video/mp4",
  webm: "video/webm",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  ogv: "video/ogg",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  m4v: "video/x-m4v",
  mp4v: "video/mp4",
  h264: "video/h264",
  "264": "video/h264",
  hevc: "video/hevc",
  "265": "video/hevc",
  // Audio formats
  mp3: "audio/mpeg",
  wav: "audio/wav",
  aac: "audio/aac",
  ogg: "audio/ogg",
  wma: "audio/x-ms-wma",
  flac: "audio/flac",
  m4a: "audio/mp4",
  // Image formats
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  ico: "image/x-icon",
  tif: "image/tiff",
  tiff: "image/tiff",
  raw: "image/raw",
  tga: "image/x-tga",
};

// Formats that are intentionally not supported by this app
// SVG is a vector format that requires specialized tools like potrace.js
// and is not part of our supported conversion formats

// Define what formats can convert to what
const SUPPORTED_CONVERSIONS = {
  // Image to Image (raster to raster only - no vector formats)
  jpg: ["jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "tga", "raw"],
  jpeg: ["jpg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "tga", "raw"],
  png: ["jpg", "jpeg", "gif", "bmp", "webp", "ico", "tif", "tiff", "tga", "raw"],
  gif: ["jpg", "jpeg", "png", "bmp", "webp", "ico", "tif", "tiff", "tga", "raw"],
  bmp: ["jpg", "jpeg", "png", "gif", "webp", "ico", "tif", "tiff", "tga", "raw"],
  webp: ["jpg", "jpeg", "png", "gif", "bmp", "ico", "tif", "tiff", "tga", "raw"],
  ico: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff", "tga", "raw"],
  tif: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tiff", "tga", "raw"],
  tiff: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tga", "raw"],
  tga: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "raw"],
  raw: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "tga"],
  // Video to Video/Audio
  mp4: ["mov", "mkv", "webm", "avi", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  mov: ["mp4", "mkv", "webm", "avi", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  mkv: ["mp4", "mov", "webm", "avi", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  webm: ["mp4", "mov", "mkv", "avi", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  avi: ["mp4", "mov", "mkv", "webm", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  "3gp": ["mp4", "mov", "mkv", "webm", "avi", "flv", "mp3", "wav", "aac", "flac"],
  flv: ["mp4", "mov", "mkv", "webm", "avi", "3gp", "mp3", "wav", "aac", "flac"],
  ogv: ["mp4", "mov", "mkv", "webm", "avi", "3gp", "flv", "mp3", "wav", "aac", "flac"],
  // Audio to Audio/Video
  mp3: ["wav", "aac", "flac", "m4a", "ogg", "wma"],
  wav: ["mp3", "aac", "flac", "m4a", "ogg", "wma"],
  aac: ["mp3", "wav", "flac", "m4a", "ogg", "wma"],
  flac: ["mp3", "wav", "aac", "m4a", "ogg", "wma"],
  m4a: ["mp3", "wav", "aac", "flac", "ogg", "wma"],
  ogg: ["mp3", "wav", "aac", "flac", "m4a", "wma"],
  wma: ["mp3", "wav", "aac", "flac", "m4a", "ogg"],
};

// Validate if a conversion is supported
function validateConversion(fromFormat, toFormat) {
  const supportedTargets = SUPPORTED_CONVERSIONS[fromFormat];
  if (!supportedTargets) {
    throw new Error(`Source format "${fromFormat}" is not recognized or supported.`);
  }

  if (!supportedTargets.includes(toFormat)) {
    throw new Error(
      `Cannot convert from ${fromFormat} to ${toFormat}. Supported target formats for ${fromFormat} are: ${supportedTargets.join(", ")}`
    );
  }
}

function getFFmpegCommand(to, input, output, fileType) {
  const isAudio = fileType.includes("audio");
  const isVideo = fileType.includes("video");
  const isImage = fileType.includes("image");

  let ffmpeg_cmd = [];

  if (to === "3gp") {
    ffmpeg_cmd = [
      "-i",
      input,
      "-r",
      "20",
      "-s",
      "352x288",
      "-vb",
      "400k",
      "-acodec",
      "aac",
      "-strict",
      "experimental",
      "-ac",
      "1",
      "-ar",
      "8000",
      "-ab",
      "24k",
      output,
    ];
  } else if (to === "mp3") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "4", output];
  } else if (to === "aac") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "aac", "-b:a", "192k", output];
  } else if (to === "wav") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
  } else if (to === "flac") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "flac", output];
  } else if (to === "m4a") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "aac", "-b:a", "192k", output];
  } else if (to === "ogg") {
    if (isAudio) {
      ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "libvorbis", "-q:a", "6", output];
    } else {
      ffmpeg_cmd = ["-i", input, "-vcodec", "libtheora", "-acodec", "libvorbis", output];
    }
  } else if (to === "wma") {
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "wmav2", output];
  } else if (to === "jpg" || to === "jpeg") {
    ffmpeg_cmd = ["-i", input, "-q:v", "2", output];
  } else if (to === "png") {
    ffmpeg_cmd = ["-i", input, "-c:v", "png", output];
  } else if (to === "bmp") {
    ffmpeg_cmd = ["-i", input, "-c:v", "bmp", output];
  } else if (to === "gif") {
    ffmpeg_cmd = ["-i", input, "-c:v", "gif", output];
  } else if (to === "tga") {
    ffmpeg_cmd = ["-i", input, "-c:v", "targa", output];
  } else if (to === "tif" || to === "tiff") {
    ffmpeg_cmd = ["-i", input, "-c:v", "tiff", output];
  } else if (to === "ico") {
    ffmpeg_cmd = ["-i", input, "-c:v", "bmp", "-s", "256x256", output];
  } else if (to === "raw") {
    // Raw image format - extract RGB pixel data
    ffmpeg_cmd = ["-i", input, "-f", "rawvideo", "-pix_fmt", "rgb24", output];
  } else if (to === "webp") {
    ffmpeg_cmd = ["-i", input, "-c:v", "libwebp", output];
  } else if (to === "webm") {
    ffmpeg_cmd = ["-i", input, "-c:v", "libvpx-vp9", "-c:a", "libopus", output];
  } else if (to === "mkv") {
    ffmpeg_cmd = ["-i", input, "-c:v", "libx264", "-c:a", "aac", output];
  } else if (to === "avi") {
    ffmpeg_cmd = ["-i", input, "-c:v", "mpeg4", "-q:v", "5", "-c:a", "libmp3lame", output];
  } else if (to === "mov") {
    ffmpeg_cmd = ["-i", input, "-c:v", "libx264", "-c:a", "aac", output];
  } else if (to === "flv") {
    ffmpeg_cmd = ["-i", input, "-c:v", "flv1", "-c:a", "libmp3lame", output];
  } else if (isImage) {
    // For any other image format, try copy codec
    ffmpeg_cmd = ["-i", input, "-c:v", "copy", output];
  } else if (isAudio) {
    // For any other audio format, try copy codec
    ffmpeg_cmd = ["-i", input, "-vn", "-c:a", "copy", output];
  } else {
    // Default fallback for video
    ffmpeg_cmd = ["-i", input, "-c:v", "copy", "-c:a", "copy", output];
  }

  return ffmpeg_cmd;
}

export default async function convertFile(ffmpeg, action) {
  const { file, to, file_name, file_type } = action;
  
  // Extract proper file extensions
  const inputExtension = getFileExtension(file_name);
  const baseName = removeFileExtension(file_name);
  const finalOutputFileName = `${baseName}.${to}`; // For download/display purposes
  
  if (!ffmpeg) {
    throw new Error("FFmpeg instance not available. Please wait for FFmpeg to initialize.");
  }

  try {
    // Validate conversion compatibility
    validateConversion(inputExtension, to);
    
    // Use safe temporary filenames without spaces for FFmpeg operations
    // Spaces in filenames can cause filesystem errors in WASM environment
    const inputFileName = `temp_input.${inputExtension}`;
    const tempOutputFileName = `temp_output.${to}`; // Use temp name for FFmpeg operations
    
    // Write input file with proper extension
    ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Execute FFmpeg with temporary output filename
    const ffmpeg_cmd = getFFmpegCommand(to, inputFileName, tempOutputFileName, file_type);
    console.log("Executing FFmpeg command:", ffmpeg_cmd);
    
    await ffmpeg.exec(ffmpeg_cmd);

    // Read from temporary output file
    const data = await ffmpeg.readFile(tempOutputFileName);
    const mimeType = MIME_TYPES[to] || "application/octet-stream";
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Clean up the temporary files
    try {
      ffmpeg.deleteFile(inputFileName);
      ffmpeg.deleteFile(tempOutputFileName);
    } catch (e) {
      console.warn("Could not delete temporary files:", e);
    }

    console.log("Conversion successful:", { finalOutputFileName, mimeType });
    return { url, output: finalOutputFileName }; // Return original filename for download
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error(`Failed to convert file to ${to}: ${error.message}`);
  }
}
