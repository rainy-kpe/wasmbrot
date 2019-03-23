mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

cfg_if::cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
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
        let pixels = (0..width * height * 4)
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

    pub fn render(&mut self) {
        let mut next = self.pixels.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                next[idx * 4 + 0] = (col % 256) as u8;
                next[idx * 4 + 1] = (col % 256) as u8;
                next[idx * 4 + 2] = (col % 256) as u8;
                next[idx * 4 + 3] = 255;
            }
        }

        self.pixels = next;
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }
}
