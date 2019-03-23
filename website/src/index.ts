import "./index.css";
import { getMemory, Universe } from "wasm-mandelbrot";

const w = 500;
const h = 500;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = w;
canvas.height = h;

const context = canvas.getContext("2d");
if (context) {
    const universe = Universe.new(w, h);
    universe.render();
    
    const pixelsPtr = universe.pixels();
    const pixels = new Uint8Array(getMemory().buffer, pixelsPtr, w * h * 4);
    
    const imgData = context.createImageData(w, h);
    for (let i = 0; i < w * h * 4; i++) {
        imgData.data[i] = pixels[i];
    }
    context.putImageData(imgData, 0, 0);
}
