mod duel;

use duel::Duel;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

thread_local! {
    static DUEL: RefCell<Option<Duel>> = RefCell::new(None);
    static CTX: RefCell<Option<CanvasRenderingContext2d>> = RefCell::new(None);
    static WIDTH: RefCell<f64> = RefCell::new(800.0);
    static HEIGHT: RefCell<f64> = RefCell::new(600.0);
}

#[wasm_bindgen]
pub fn init(canvas_id: &str) {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document
        .get_element_by_id(canvas_id)
        .unwrap()
        .dyn_into::<HtmlCanvasElement>()
        .unwrap();
    let ctx = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<CanvasRenderingContext2d>()
        .unwrap();

    CTX.with(|c| *c.borrow_mut() = Some(ctx));
    DUEL.with(|d| *d.borrow_mut() = Some(Duel::new()));
}

#[wasm_bindgen]
pub fn tick(dt: f64) {
    DUEL.with(|d| {
        if let Some(ref mut duel) = *d.borrow_mut() {
            duel.tick(dt);
        }
    });
}

#[wasm_bindgen]
pub fn render() {
    CTX.with(|ctx| {
        let ctx = match ctx.borrow().as_ref() {
            Some(c) => c.clone(),
            None => return,
        };
        let w = WIDTH.with(|w| *w.borrow());
        let h = HEIGHT.with(|h| *h.borrow());

        ctx.clear_rect(0.0, 0.0, w, h);

        DUEL.with(|d| {
            if let Some(ref duel) = *d.borrow() {
                duel.draw(&ctx, w, h);
            }
        });
    });
}

#[wasm_bindgen]
pub fn resize(width: f64, height: f64) {
    WIDTH.with(|w| *w.borrow_mut() = width);
    HEIGHT.with(|h| *h.borrow_mut() = height);
}

#[wasm_bindgen]
pub fn select_action(index: usize) {
    DUEL.with(|d| {
        if let Some(ref mut duel) = *d.borrow_mut() {
            duel.select_action(index);
        }
    });
}

#[wasm_bindgen]
pub fn get_state() -> String {
    DUEL.with(|d| {
        match *d.borrow() {
            Some(ref duel) => duel.state_json(),
            None => r#"{"phase":"loading"}"#.to_string(),
        }
    })
}
