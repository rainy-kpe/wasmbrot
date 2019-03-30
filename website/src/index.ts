import "./index.css";
import { getMemory, Universe } from "wasm-mandelbrot";
import { render as jsRender } from "./mandelbrot";

const w = 500;
const h = 500;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = w;
canvas.height = h;
const universe = Universe.new(w, h);

const render = (re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
    console.time("Render");
    const context = canvas.getContext("2d");
    if (context) {
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
    }

    console.timeEnd("Render");
};

const renderJS = (re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
    console.time("RenderJS");
    const context = canvas.getContext("2d");
    if (context) {
        jsRender(context, w, h, re1, re2, img1, img2, max_iter);
    }
    console.timeEnd("RenderJS");
};

render(-2.0, 1.0, -1.5, 1.5, 2048);
renderJS(-2.0, 1.0, -1.5, 1.5, 2048);

(window as any).render = render;