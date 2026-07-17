use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

thread_local! {
    static CTX: RefCell<Option<CanvasRenderingContext2d>> = RefCell::new(None);
    static WIDTH: RefCell<f64> = RefCell::new(800.0);
    static HEIGHT: RefCell<f64> = RefCell::new(600.0);
    static TIME: RefCell<f64> = RefCell::new(0.0);
    static X: RefCell<f64> = RefCell::new(100.0);
    static Y: RefCell<f64> = RefCell::new(100.0);
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
    TIME.with(|t| *t.borrow_mut() = 0.0);
    X.with(|x| *x.borrow_mut() = 100.0);
    Y.with(|y| *y.borrow_mut() = 100.0);
}

#[wasm_bindgen]
pub fn tick(dt: f64) {
    TIME.with(|t| {
        let mut time = t.borrow_mut();
        *time += dt;
        let t = *time;

        X.with(|x| *x.borrow_mut() = 100.0 + (t * 60.0).sin() * 150.0);
        Y.with(|y| *y.borrow_mut() = 100.0 + (t * 45.0).cos() * 100.0);
    });
}

#[wasm_bindgen]
pub fn render(fps: f64) {
    CTX.with(|ctx| {
        let ctx = match ctx.borrow().as_ref() {
            Some(c) => c.clone(),
            None => return,
        };

        let w = WIDTH.with(|w| *w.borrow());
        let h = HEIGHT.with(|h| *h.borrow());

        ctx.clear_rect(0.0, 0.0, w, h);

        ctx.set_fill_style(&JsValue::from_str("#0a0a0f"));
        ctx.fill_rect(0.0, 0.0, w, h);

        let (px, py, sec) = X.with(|x| Y.with(|y| TIME.with(|t| (*x.borrow(), *y.borrow(), *t.borrow()))));

        ctx.set_fill_style(&JsValue::from_str("#ff4444"));
        ctx.begin_path();
        let _ = ctx.arc(px, py, 24.0, 0.0, std::f64::consts::TAU);
        ctx.fill();

        ctx.set_fill_style(&JsValue::from_str("#ff8888"));
        ctx.begin_path();
        let _ = ctx.arc(
            px + (sec * 120.0).cos() * 30.0,
            py + (sec * 120.0).sin() * 30.0,
            8.0,
            0.0,
            std::f64::consts::TAU,
        );
        ctx.fill();

        ctx.set_font("14px monospace");
        ctx.set_fill_style(&JsValue::from_str("#888"));
        let _ = ctx.fill_text(&format!("Pokemon  |  {:.0} FPS", fps), 12.0, 24.0);
    });
}

#[wasm_bindgen]
pub fn resize(width: f64, height: f64) {
    WIDTH.with(|w| *w.borrow_mut() = width);
    HEIGHT.with(|h| *h.borrow_mut() = height);
}
