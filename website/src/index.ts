import "./index.css";
import { render as wasmRender } from "./mandelbrot-wasm";
import { render as jsRender } from "./mandelbrot-js";
import { render as jsRenderWorker } from "./mandelbrot-worker";

const w = 500;
const h = 500;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = w;
canvas.height = h;

const renderWasm = async (re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
  const context = canvas.getContext("2d");
  if (context) {
    wasmRender(context, w, h, re1, re2, img1, img2, max_iter);
  }
};

const renderJS = async (re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
  const context = canvas.getContext("2d");
  if (context) {
    jsRender(context, w, h, re1, re2, img1, img2, max_iter);
  }
};

const renderJSWorker = async (re1: number, re2: number, img1: number, img2: number, max_iter: number) => {
  const context = canvas.getContext("2d");
  if (context) {
    await jsRenderWorker(context, w, h, re1, re2, img1, img2, max_iter);
  }
};

const measure = async (f: Function, name: string) => {
  const t0 = performance.now();
  console.time(name);
  await f();
  console.timeEnd(name);
  const t1 = performance.now();
  const div = document.getElementById("time") as HTMLDivElement;
  div.innerText = `${t1 - t0} ms`;
}

//measure(() => renderWasm(-2.0, 1.0, -1.5, 1.5, 2048), "Webassembly");
//measure(() => renderJS(-2.0, 1.0, -1.5, 1.5, 2048), "Plain JS");
//measure(() => renderJSWorker(-2.0, 1.0, -1.5, 1.5, 1024), "JS+Workers");

let offset_x = -0.75;
let offset_y = -0.5;
let re1 = -2.0;
let re2 = 1.0;
let img1 = -1.5;
let img2 = 1.5;
let max_iter = 256;
let count = 0;

const renderLoop = () => {
  // measure(() => renderWasm(re1 + offset_x, re2 + offset_x, img1, img2, max_iter), `Webassembly-${count}`);
  // measure(() => renderJS(re1 + offset_x, re2 + offset_x, img1, img2, max_iter), `Plain JS-${count}`);
  measure(() => renderJSWorker(re1 + offset_x, re2 + offset_x, img1, img2, max_iter), `JS+Workers-${count}`);
  re1 = re1 * 0.95;
  re2 = re2 * 0.95;
  img1 = img1 * 0.975;
  img2 = img2 * 0.975;
  // max_iter = max_iter * 1.1;
  if (count < 100) {
     requestAnimationFrame(renderLoop);
  }
  count++;
};

renderLoop();
