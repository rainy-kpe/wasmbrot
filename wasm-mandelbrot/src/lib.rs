extern crate num_complex;

mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;
use num_complex::Complex64;

cfg_if::cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

struct MandelConfig {
    pub re1: f64,
    pub re2: f64,
    pub img1: f64,
    pub img2: f64,
    pub max_iter: u32,
    pub width: u32,
    pub height: u32
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    pixels: Vec<u8>
}

#[wasm_bindgen]
pub fn getMemory() -> wasm_bindgen::JsValue {
    wasm_bindgen::memory()
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, height: u32) -> Universe {
        let pixels = (0..width * height)
            .map(|_i| { 0 })
            .collect();

        Universe {
            width,
            height,
            pixels
        }
    }

    pub fn pixels(&self) -> *const u8 {
        self.pixels.as_ptr()
    }

    pub fn render(&mut self, re1: f64, re2: f64, img1: f64, img2: f64, max_iter: u32) {
        log("Rendering...");

        let config = MandelConfig {
            re1: re1,
            re2: re2,
            img1: img1,
            img2: img2,
            max_iter: max_iter,
            width: self.width,
            height: self.height
        };
        let mut image: Vec<u32> = vec![0; (config.width * config.height) as usize];
        calc(&config, &mut image);

        let mut next = self.pixels.clone();
        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);

                if image[idx] == config.max_iter {
                    next[idx] = 0;
                } else {
                    next[idx] = ((image[idx] % 16) * 16) as u8;
                }

            }
        }
        self.pixels = next;
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }
}

fn calc(config: &MandelConfig, image: &mut [u32]) {
    let x_step = (config.re2 - config.re1) / (config.width as f64);
    let y_step = (config.img2 - config.img1) / (config.height as f64);

    for y in 0..config.height {
        for x in 0..config.width {
            image[((y * config.height) + x) as usize] =
                mandel_iter(config.max_iter,
                    Complex64{re: config.re1 + ((x as f64) * x_step),
                              im: config.img1 + ((y as f64) * y_step)}
                );
        }
    }
}

fn mandel_iter(max_iter: u32, c: Complex64) -> u32 {
    let mut z: Complex64 = c;

    let mut iter = 0;

    while (z.norm_sqr() <= 4.0) && (iter < max_iter) {
        z = c + (z * z);
        iter = iter + 1;
    }

    iter
}