const iterateEquation = (x0: number, y0: number, max_iter: number) => {
  let a = 0, b = 0, rx = 0, ry = 0;
  let iterations = 0;
  while (iterations < max_iter && (rx * rx + ry * ry <= 4)) {
    rx = a * a - b * b + x0;
    ry = 2 * a * b + y0;
    a = rx;
    b = ry;
    iterations++;
  }
  return iterations;
}

export function render(context: CanvasRenderingContext2D, w: number, h: number, re1: number, re2: number, img1: number, img2: number, max_iter: number) {
  const imgData = context.createImageData(w, h);

  const x_step = (re2 - re1) / w;
  const y_step = (img2 - img1) / h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const rx = re1 + x * x_step;
      const ry = img1 + y * y_step;
      const iterations = iterateEquation(rx, ry, max_iter);

      const idx = (x + y * w) << 2;
      const outside = iterations === max_iter;
      const color = (iterations % 16) * 16;
      imgData.data[idx + 0] = outside ? 0 : color;
      imgData.data[idx + 1] = outside ? 0 : color;
      imgData.data[idx + 2] = outside ? 0 : color;
      imgData.data[idx + 3] = 255;
    }
  }

  context.putImageData(imgData, 0, 0);
}
