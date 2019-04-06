import { RendererOptions } from "../components/RenderView/RenderView";
import workerpool from "workerpool";

const pool = workerpool.pool();

const iterateRow = (w: number, re1: number, x_step: number, ry: number, max_iter: number) => {

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
  
  const colors: number[] = [];
  for (let x = 0; x < w; x++) {
    const rx = re1 + x * x_step;
    const iterations = iterateEquation(rx, ry, max_iter);
    const outside = iterations === max_iter;
    const color = (iterations % 16) * 16;
    colors.push(outside ? 0 : color);
  }
  return colors;
};

export async function render(context: CanvasRenderingContext2D, options: RendererOptions) {
  const { w, h, re1, re2, img1, img2, max_iter } = options;

  const imgData = context.createImageData(w, h);

  const x_step = (re2 - re1) / w;
  const y_step = (img2 - img1) / h;

  const promises: workerpool.Promise<void>[] = [];

  for (let y = 0; y < h; y++) {
    const ry = img1 + y * y_step;
    promises.push(pool.exec(iterateRow, [w, re1, x_step, ry, max_iter]).then((colors: number[]) => {
      for (let x = 0; x < w; x++) {
        const idx = (x + y * w) << 2;
        const color = colors[x];
        imgData.data[idx + 0] = color;
        imgData.data[idx + 1] = color;
        imgData.data[idx + 2] = color;
        imgData.data[idx + 3] = 255;
      }
    }));
  }
  await workerpool.Promise.all(promises);
  pool.terminate();
  context.putImageData(imgData, 0, 0);
}

