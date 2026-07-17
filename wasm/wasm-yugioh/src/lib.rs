use std::cell::RefCell;
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

thread_local! {
    static CTX: RefCell<Option<CanvasRenderingContext2d>> = RefCell::new(None);
    static WIDTH: RefCell<f64> = RefCell::new(800.0);
    static HEIGHT: RefCell<f64> = RefCell::new(600.0);
    static TIME: RefCell<f64> = RefCell::new(0.0);
    static CX: RefCell<f64> = RefCell::new(400.0);
    static CY: RefCell<f64> = RefCell::new(300.0);
    static ROTATION: RefCell<f64> = RefCell::new(0.0);
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
    CX.with(|x| *x.borrow_mut() = 400.0);
    CY.with(|y| *y.borrow_mut() = 300.0);
    ROTATION.with(|r| *r.borrow_mut() = 0.0);
}

#[wasm_bindgen]
pub fn tick(dt: f64) {
    TIME.with(|t| {
        let mut time = t.borrow_mut();
        *time += dt;

        ROTATION.with(|r| *r.borrow_mut() = (*time * 90.0).sin() * 0.3);
        CX.with(|x| *x.borrow_mut() = 400.0 + (*time * 30.0).sin() * 100.0);
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

        let (cx, cy, rot, sec) = CX.with(|x| {
            CY.with(|y| ROTATION.with(|r| TIME.with(|t| (*x.borrow(), *y.borrow(), *r.borrow(), *t.borrow()))))
        });

        ctx.save();

        ctx.translate(cx, cy).unwrap();
        ctx.rotate(rot).unwrap();

        ctx.set_fill_style(&JsValue::from_str("#44aaff"));
        ctx.fill_rect(-50.0, -35.0, 100.0, 70.0);

        ctx.set_stroke_style(&JsValue::from_str("#88ccff"));
        ctx.set_line_width(2.0);
        ctx.stroke_rect(-50.0, -35.0, 100.0, 70.0);

        ctx.set_fill_style(&JsValue::from_str("#fff"));
        ctx.set_font("12px monospace");
        ctx.set_text_align("center");
        let _ = ctx.fill_text("Yu-Gi-Oh!", 0.0, 5.0);

        ctx.restore();

        ctx.set_text_align("start");
        ctx.set_font("14px monospace");
        ctx.set_fill_style(&JsValue::from_str("#888"));
        let _ = ctx.fill_text(&format!("Yu-Gi-Oh!  |  {:.0} FPS", fps), 12.0, 24.0);
    });
}

#[wasm_bindgen]
pub fn resize(width: f64, height: f64) {
    WIDTH.with(|w| *w.borrow_mut() = width);
    HEIGHT.with(|h| *h.borrow_mut() = height);
}
