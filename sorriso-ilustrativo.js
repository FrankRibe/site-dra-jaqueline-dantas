// The mask follows the upper arch in coordinates of the upright, 320 × 240 reference.
const upperArch = new Path2D('M51 79 Q72 85 94 83 Q110 85 121 82 Q141 83 154 80 Q180 76 192 80 Q210 75 219 80 Q238 77 247 78 L274 75 L273 91 Q261 107 248 107 Q234 118 219 118 Q206 126 191 124 Q176 133 156 130 Q135 133 121 128 Q107 128 96 124 Q82 124 76 115 Q63 115 61 106 Q51 106 51 95 Z');
let smileReference;
function loadSmileReference() {
  if (smileReference) return smileReference;
  smileReference = new Promise((resolve, reject) => {
    const photo = new Image();
    photo.onload = () => {
      const buffer = document.createElement('canvas');
      buffer.width = 640;
      buffer.height = 400;
      const ctx = buffer.getContext('2d');
      ctx.translate(640, -40);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(photo, 0, 0, 480, 640);
      const original = ctx.getImageData(0, 0, 640, 400);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, 640, 400);
      ctx.setTransform(2, 0, 0, 2, 0, -40);
      ctx.fill(upperArch);
      const mask = ctx.getImageData(0, 0, 640, 400).data;
      resolve({original, mask});
    };
    photo.onerror = reject;
    photo.src = 'assets/casos/Dagv8QDDVv4.jpg';
  }).catch(error => { smileReference = null; throw error; });
  return smileReference;
}

const smileRequests = new WeakMap();
async function drawIllustratedSmile(canvas, tone, porcelain) {
  const request = Symbol();
  smileRequests.set(canvas, request);
  let reference;
  try {
    reference = await loadSmileReference();
  } catch {
    if (smileRequests.get(canvas) === request)
      canvas.nextElementSibling.textContent = 'A foto não carregou. Toque em Ver no sorriso para tentar novamente.';
    return;
  }
  if (canvas.hidden || smileRequests.get(canvas) !== request) return;
  const {original, mask} = reference;
  const frame = new ImageData(new Uint8ClampedArray(original.data), original.width, original.height);
  const pixels = frame.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (!mask[i + 3]) continue;
    const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
    // Isolate enamel from pink tissue and retain the photographed surface detail.
    const enamel = Math.max(0, Math.min(1, (32 - (r - g)) / 24));
    const weight = enamel * mask[i + 3] / 255;
    const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 233;
    const reflection = Math.max(0, light - 0.94) * (porcelain ? 55 : 25);
    for (let channel = 0; channel < 3; channel++) {
      pixels[i + channel] += weight * (tone[channel] * light + reflection - pixels[i + channel]);
    }
  }
  canvas.getContext('2d').putImageData(frame, 0, 0);
}
