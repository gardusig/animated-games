use wasm_bindgen::prelude::*;

static mut WIDTH: f64 = 800.0;
static mut HEIGHT: f64 = 600.0;
static mut TIME: f64 = 0.0;
static mut POKEMON_X: f64 = 0.0;
static mut POKEMON_Y: f64 = 0.0;

#[wasm_bindgen]
pub fn init() {
    unsafe {
        TIME = 0.0;
        POKEMON_X = 100.0;
        POKEMON_Y = 100.0;
    }
}

#[wasm_bindgen]
pub fn tick(dt: f64) {
    unsafe {
        TIME += dt;
        POKEMON_X += (TIME * 60.0).sin() * 2.0;
        POKEMON_Y += (TIME * 45.0).cos() * 1.5;
    }
}

#[wasm_bindgen]
pub fn get_state() -> String {
    unsafe {
        format!(r#"{{"x":{},"y":{},"time":{}}}"#, POKEMON_X, POKEMON_Y, TIME)
    }
}

#[wasm_bindgen]
pub fn resize(width: f64, height: f64) {
    unsafe {
        WIDTH = width;
        HEIGHT = height;
    }
}
