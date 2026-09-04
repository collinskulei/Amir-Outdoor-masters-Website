import { Jimp, intToRGBA } from "jimp";

const SRC = "C:/Users/user/Downloads/amir logo.png";
const OUT = "C:/Users/user/Downloads/amir logo-transparent.png";

const image = await Jimp.read(SRC);
const { width, height } = image.bitmap;

function isBackground(r, g, b) {
  return r > 235 && g > 235 && b > 235;
}

const visited = new Uint8Array(width * height);
const queue = [];

function maybeEnqueue(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const idx = y * width + x;
  if (visited[idx]) return;
  const { r, g, b } = intToRGBA(image.getPixelColor(x, y));
  if (!isBackground(r, g, b)) return;
  visited[idx] = 1;
  queue.push([x, y]);
}

// Seed the flood fill from every border pixel that's background-colored.
for (let x = 0; x < width; x++) {
  maybeEnqueue(x, 0);
  maybeEnqueue(x, height - 1);
}
for (let y = 0; y < height; y++) {
  maybeEnqueue(0, y);
  maybeEnqueue(width - 1, y);
}

let cleared = 0;
while (queue.length) {
  const [x, y] = queue.pop();
  image.setPixelColor(0x00000000, x, y);
  cleared++;
  maybeEnqueue(x + 1, y);
  maybeEnqueue(x - 1, y);
  maybeEnqueue(x, y + 1);
  maybeEnqueue(x, y - 1);
}

console.log(`Pass 1 (border flood-fill): cleared ${cleared} of ${width * height} pixels.`);

// Pass 2: the "AMIR" wordmark's letter counters (the enclosed triangle in A,
// the bowl in R) are white background fully encircled by green strokes, so
// the border-seeded flood fill above can never reach them. They only exist
// above the solid green bar (y < 320); the "OUTDOOR MASTERS" wordmark below
// that line is genuine white text and must stay opaque, so this pass is
// restricted to y < 320 to avoid touching it.
let clearedPass2 = 0;
for (let y = 0; y < Math.min(320, height); y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    if (visited[idx]) continue;
    const { r, g, b, a } = intToRGBA(image.getPixelColor(x, y));
    if (a === 0) continue;
    if (r > 235 && g > 235 && b > 235) {
      image.setPixelColor(0x00000000, x, y);
      clearedPass2++;
    }
  }
}
console.log(`Pass 2 (letter counters above y=320): cleared ${clearedPass2} pixels.`);
await image.write(OUT);
console.log("Wrote", OUT);
