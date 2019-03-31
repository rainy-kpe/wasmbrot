import { getMemory, Universe } from "wasm-mandelbrot";

export const render = (context: CanvasRenderingContext2D, w: number, h: number, re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
  const universe = Universe.new(w, h);
  universe.render(re1, re2, img1, img2, max_iter);
  
  const pixelsPtr = universe.pixels();
  const pixels = new Uint8Array(getMemory().buffer, pixelsPtr, w * h);
  
  const imgData = context.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    imgData.data[i * 4 + 0] = pixels[i];
    imgData.data[i * 4 + 1] = pixels[i];
    imgData.data[i * 4 + 2] = pixels[i];
    imgData.data[i * 4 + 3] = 255;
  }
  context.putImageData(imgData, 0, 0);
};
