# 🧠 ConvertMate

**ConvertMate** is a powerful and user-friendly file conversion tool built with **React.js**, enabling users to convert various types of files seamlessly — such as **PNG to JPG**, **MP4 to MP3**, **DOCX to PDF**, and more. Whether you're working with images, audio, video, or documents, ConvertMate simplifies the process with just a few clicks.

🌐 Live Demo: [convert-mate.vercel.app](https://convert-mate.vercel.app)

---

## ✨ Features

- 🔁 Convert between popular file formats (images, audio, video, documents)
- ⚡ Fast and efficient in-browser processing
- 🧩 Drag and drop support
- 🎨 Clean and modern UI with shadcn/ui & Tailwind CSS
- 📱 Fully responsive and mobile-friendly
- 🛡️ Safe & secure: All conversions happen locally (if supported) or through trusted APIs

---

## 🧰 Tech Stack

- **Frontend**: [React.js](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Conversion Engine**:
  - [FFmpeg](https://ffmpeg.org/) (via WebAssembly or cloud for media processing)
  - Native browser APIs for basic conversions
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📷 Supported Conversions

Here are just a few examples of what ConvertMate supports:

- **Images**: PNG → JPG, JPG → WebP, etc.
- **Audio**: MP4 → MP3, WAV → MP3, etc.
- **Video**: AVI → MP4, WebM → MP4, etc.
- **Documents**: DOCX → PDF, PPTX → PDF, etc.

More formats are being added regularly!

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16)
- npm or yarn

### Installation

```bash
git clone https://github.com/svijithprasad/ConvertMate.git
cd ConvertMate
npm install
