import { RendererOptions } from "../components/RenderView/RenderView";
import { getMemory, Universe } from "wasm-mandelbrot";

export async function render(context: CanvasRenderingContext2D, options: RendererOptions) {
  const { w, h, re1, re2, img1, img2, max_iter } = options;

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
