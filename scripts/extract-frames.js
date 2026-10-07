import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const videoPath = path.join(rootDir, 'Building_block_model_film_creation_20261006195849.mp4');
const outputDir = path.join(rootDir, 'public', 'hero', 'frames');

console.log('--- Clemmo HP Frame Extraction Script ---');
console.log(`Video source: ${videoPath}`);
console.log(`Output directory: ${outputDir}`);

if (!fs.existsSync(videoPath)) {
  console.error(`Error: Video source not found at ${videoPath}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

// Check 1: Python with cv2
let pythonSucceeded = false;
try {
  console.log('Checking for Python with OpenCV...');
  const pyCheck = spawnSync('python', ['-c', 'import cv2; print("OK")'], { encoding: 'utf-8' });
  if (pyCheck.status === 0 && pyCheck.stdout.includes('OK')) {
    console.log('Python with OpenCV detected. Running extract_frames.py...');
    const result = spawnSync('python', [path.join(__dirname, 'extract_frames.py')], {
      stdio: 'inherit',
      cwd: rootDir,
    });
    if (result.status === 0) {
      pythonSucceeded = true;
    }
  }
} catch (e) {
  // Python check failed, proceed to ffmpeg
}

if (!pythonSucceeded) {
  // Check 2: FFmpeg
  console.log('Checking for FFmpeg...');
  let ffmpegAvailable = false;
  try {
    const ffCheck = spawnSync('ffmpeg', ['-version'], { encoding: 'utf-8' });
    ffmpegAvailable = ffCheck.status === 0;
  } catch (e) {
    ffmpegAvailable = false;
  }

  if (ffmpegAvailable) {
    console.log('FFmpeg detected. Extracting 144 WebP frames...');
    // Target ~18 fps for 8 seconds => ~144 frames
    const cmd = `ffmpeg -y -i "${videoPath}" -vf "fps=18,scale=1280:720" -vcodec libwebp -lossless 0 -qscale 85 "${path.join(outputDir, 'frame_%03d.webp')}"`;
    try {
      execSync(cmd, { stdio: 'inherit', cwd: rootDir });
      console.log('FFmpeg extraction completed successfully.');
    } catch (err) {
      console.error('FFmpeg extraction failed:', err);
      process.exit(1);
    }
  } else {
    console.error(`
[ERROR] Neither Python OpenCV nor FFmpeg was found.
Requirements:
1. Python with OpenCV installed: run 'pip install opencv-python' and rerun 'npm run extract-frames'
   OR
2. FFmpeg installed on system PATH: download from https://ffmpeg.org/
`);
    process.exit(1);
  }
}
