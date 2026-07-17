use wasm_bindgen::prelude::*;

static mut WIDTH: f64 = 800.0;
static mut HEIGHT: f64 = 600.0;
static mut TIME: f64 = 0.0;
static mut CARD_X: f64 = 400.0;
static mut CARD_Y: f64 = 300.0;
static mut CARD_ROTATION: f64 = 0.0;

#[wasm_bindgen]
pub fn init() {
    unsafe {
        TIME = 0.0;
        CARD_X = 400.0;
        CARD_Y = 300.0;
        CARD_ROTATION = 0.0;
    }
}

#[wasm_bindgen]
pub fn tick(dt: f64) {
    unsafe {
        TIME += dt;
        CARD_ROTATION = (TIME * 120.0).sin() * 0.2;
    }
}

#[wasm_bindgen]
pub fn get_state() -> String {
    unsafe {
        format!(
            r#"{{"x":{},"y":{},"rotation":{},"time":{}}}"#,
            CARD_X, CARD_Y, CARD_ROTATION, TIME
        )
    }
}

#[wasm_bindgen]
pub fn resize(width: f64, height: f64) {
    unsafe {
        WIDTH = width;
        HEIGHT = height;
    }
}
