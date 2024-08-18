import { fetchFile } from "@ffmpeg/util";

function getFileExtension(file_name) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
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

export default async function convertFile(ffmpeg, action) {
  const { file, to, file_name, file_type } = action;
  const input = getFileExtension(file_name);
  const output = removeFileExtension(file_name) + "." + to;
  ffmpeg.writeFile(input, await fetchFile(file));

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
    ffmpeg_cmd = ["-i", input, "-vn", "-acodec", "libmp3lame", output];
  } else if (to === "jpg" || to === "jpeg") {
    ffmpeg_cmd = ["-i", input, "-q:v", "2", output];
  } else {
    ffmpeg_cmd = ["-i", input, output];
  }

  await ffmpeg.exec(ffmpeg_cmd);

  const data = await ffmpeg.readFile(output);
  const blob = new Blob([data], { type: file_type.split("/")[0] });
  const url = URL.createObjectURL(blob);
  console.log(url);
  return { url, output };
}
