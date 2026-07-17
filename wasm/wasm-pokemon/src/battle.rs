use wasm_bindgen::JsValue;
use web_sys::CanvasRenderingContext2d;

const TAU: f64 = std::f64::consts::TAU;

pub struct Pokemon {
    pub name: &'static str,
    pub level: u32,
    pub max_hp: f64,
    pub hp: f64,
    pub moves: [Move; 4],
    pub color: &'static str,
}

pub struct Move {
    pub name: &'static str,
    pub power: f64,
    pub _kind: MoveKind,
}

#[allow(dead_code)]
pub enum MoveKind {
    Normal,
    Special,
}

pub struct Anim {
    pub kind: AnimKind,
    pub timer: f64,
    pub duration: f64,
}

#[allow(dead_code)]
pub enum AnimKind {
    None,
    PlayerAttack,
    EnemyAttack,
    PlayerHit,
    EnemyHit,
    FadeOut,
    FadeIn,
}

pub enum Phase {
    Intro,
    PlayerSelect,
    PlayerAnim,
    EnemyAnim,
    GameOver,
}

pub struct Battle {
    pub player: Pokemon,
    pub enemy: Pokemon,
    pub phase: Phase,
    pub anim: Anim,
    pub log: Vec<String>,
    pub winner: Option<&'static str>,
}

impl Battle {
    pub fn new() -> Self {
        Battle {
            player: Pokemon {
                name: "Pikachu",
                level: 5,
                max_hp: 100.0,
                hp: 100.0,
                color: "#ffd700",
                moves: [
                    Move { name: "Thunder Shock", power: 40.0, _kind: MoveKind::Special },
                    Move { name: "Quick Attack", power: 40.0, _kind: MoveKind::Normal },
                    Move { name: "Iron Tail", power: 80.0, _kind: MoveKind::Normal },
                    Move { name: "Growl", power: 0.0, _kind: MoveKind::Normal },
                ],
            },
            enemy: Pokemon {
                name: "Charmander",
                level: 5,
                max_hp: 90.0,
                hp: 90.0,
                color: "#ff6b35",
                moves: [
                    Move { name: "Ember", power: 40.0, _kind: MoveKind::Special },
                    Move { name: "Scratch", power: 40.0, _kind: MoveKind::Normal },
                    Move { name: "Leer", power: 0.0, _kind: MoveKind::Normal },
                    Move { name: "Tail Whip", power: 0.0, _kind: MoveKind::Normal },
                ],
            },
            phase: Phase::Intro,
            anim: Anim { kind: AnimKind::FadeIn, timer: 0.0, duration: 1.0 },
            log: vec!["Wild Charmander appeared!".to_string(), "Go Pikachu!".to_string()],
            winner: None,
        }
    }

    pub fn tick(&mut self, dt: f64) {
        self.anim.timer += dt;

        match self.phase {
            Phase::Intro => {
                if self.anim.timer >= self.anim.duration {
                    self.anim = Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 };
                    self.phase = Phase::PlayerSelect;
                }
            }
            Phase::PlayerAnim => {
                if self.anim.timer >= self.anim.duration {
                    self.anim = Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 };
                    if self.enemy.hp <= 0.0 {
                        self.winner = Some(self.player.name);
                        self.log.push(format!("{} defeated {}!", self.player.name, self.enemy.name));
                        self.phase = Phase::GameOver;
                    } else {
                        self.enemy_turn();
                    }
                }
            }
            Phase::EnemyAnim => {
                if self.anim.timer >= self.anim.duration {
                    self.anim = Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 };
                    if self.player.hp <= 0.0 {
                        self.winner = Some(self.enemy.name);
                        self.log.push(format!("{} fainted...", self.player.name));
                        self.phase = Phase::GameOver;
                    } else {
                        self.phase = Phase::PlayerSelect;
                    }
                }
            }
            Phase::GameOver | Phase::PlayerSelect => {}
        }
    }

    pub fn select_action(&mut self, index: usize) {
        if !matches!(self.phase, Phase::PlayerSelect) {
            return;
        }
        if index >= 4 {
            return;
        }

        let move_ = &self.player.moves[index];
        let dmg = Self::calc_damage(&self.player, &self.enemy, move_);
        self.enemy.hp = (self.enemy.hp - dmg).max(0.0);

        self.log.push(format!("{} used {}!", self.player.name, move_.name));
        if dmg > 0.0 {
            self.log.push(format!("It dealt {:.0} damage!", dmg));
        }
        if self.log.len() > 20 {
            self.log.remove(0);
        }

        self.anim = Anim { kind: AnimKind::PlayerAttack, timer: 0.0, duration: 0.6 };
        self.phase = Phase::PlayerAnim;
    }

    fn enemy_turn(&mut self) {
        let idx = (self.anim.timer as usize) % 4;
        let move_ = &self.enemy.moves[idx];
        let dmg = Self::calc_damage(&self.enemy, &self.player, move_);
        self.player.hp = (self.player.hp - dmg).max(0.0);

        self.log.push(format!("{} used {}!", self.enemy.name, move_.name));
        if dmg > 0.0 {
            self.log.push(format!("It dealt {:.0} damage!", dmg));
        }
        if self.log.len() > 20 {
            self.log.remove(0);
        }

        self.anim = Anim { kind: AnimKind::EnemyAttack, timer: 0.0, duration: 0.6 };
        self.phase = Phase::EnemyAnim;
    }

    fn calc_damage(attacker: &Pokemon, defender: &Pokemon, move_: &Move) -> f64 {
        if move_.power == 0.0 {
            return 0.0;
        }
        let base = ((2.0 * attacker.level as f64 / 5.0 + 2.0) * move_.power) / 50.0 + 2.0;
        let modifier = 0.85 + (Self::rng() * 0.15);
        base * modifier
    }

    fn rng() -> f64 {
        (js_sys::Math::random() * 1000.0).round() / 1000.0
    }

    pub fn state_json(&self) -> String {
        let phase_str = match self.phase {
            Phase::Intro => "intro",
            Phase::PlayerSelect => "select",
            Phase::PlayerAnim => "anim",
            Phase::EnemyAnim => "anim",
            Phase::GameOver => "gameover",
        };

        let actions: Vec<String> = self.player.moves.iter()
            .map(|m| format!(r#""{}""#, m.name))
            .collect();

        let visible: Vec<&str> = self.log.iter().rev().take(4).rev().map(|s| s.as_str()).collect();
        let log_json: Vec<String> = visible.iter().map(|s| serde_json_to_string(s)).collect();

        format!(
            r#"{{"phase":"{}","playerHp":{},"playerMaxHp":{},"enemyHp":{},"enemyMaxHp":{},"playerName":"{}","enemyName":"{}","moves":[{}],"log":[{}],"winner":{}}}"#,
            phase_str,
            self.player.hp,
            self.player.max_hp,
            self.enemy.hp,
            self.enemy.max_hp,
            self.player.name,
            self.enemy.name,
            actions.join(","),
            log_json.join(","),
            match self.winner {
                Some(w) => format!(r#""{}""#, w),
                None => "null".to_string(),
            }
        )
    }

    pub fn draw(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("#1a1a2e"));
        ctx.fill_rect(0.0, 0.0, w, h);

        ctx.set_fill_style(&JsValue::from_str("#16213e"));
        ctx.fill_rect(0.0, 0.0, w, h * 0.6);

        ctx.set_fill_style(&JsValue::from_str("#0f3460"));
        ctx.fill_rect(0.0, 0.0, w, h * 0.05);

        let shake_x = match self.anim.kind {
            AnimKind::EnemyHit | AnimKind::PlayerAttack => (self.anim.timer * 60.0).sin() * 6.0,
            _ => 0.0,
        };
        let shake_y = match self.anim.kind {
            AnimKind::PlayerHit | AnimKind::EnemyAttack => (self.anim.timer * 60.0).sin() * 6.0,
            _ => 0.0,
        };

        let progress = match self.anim.kind {
            AnimKind::FadeIn => (self.anim.timer / self.anim.duration).min(1.0),
            AnimKind::FadeOut => 1.0 - (self.anim.timer / self.anim.duration).min(1.0),
            _ => 1.0,
        };

        ctx.save();
        ctx.set_global_alpha(progress);

        self.draw_pokemon(ctx, &self.enemy, w * 0.65, h * 0.25, shake_x, shake_y);
        self.draw_pokemon(ctx, &self.player, w * 0.25, h * 0.35, shake_x, shake_y);

        self.draw_hp_bar(ctx, &self.enemy, w * 0.55, h * 0.08, w * 0.3, 14.0);
        self.draw_hp_bar(ctx, &self.player, w * 0.15, h * 0.55, w * 0.3, 14.0);

        ctx.restore();

        self.draw_log(ctx, w, h);
        self.draw_footer(ctx, w, h);

        if matches!(self.phase, Phase::GameOver) {
            self.draw_gameover(ctx, w, h);
        }
    }

    fn draw_pokemon(&self, ctx: &CanvasRenderingContext2d, mon: &Pokemon, cx: f64, cy: f64, sx: f64, sy: f64) {
        ctx.save();
        ctx.translate(cx + sx, cy + sy).unwrap();

        let flash = match self.anim.kind {
            AnimKind::PlayerHit | AnimKind::EnemyHit => (self.anim.timer * 20.0).sin() > 0.0,
            _ => false,
        };

        ctx.set_fill_style(&JsValue::from_str(if flash { "#fff" } else { mon.color }));
        ctx.begin_path();
        let _ = ctx.arc(0.0, 0.0, 40.0, 0.0, TAU);
        ctx.fill();

        ctx.begin_path();
        let _ = ctx.arc(0.0, -40.0, 28.0, 0.0, TAU);
        ctx.fill();

        ctx.begin_path();
        let _ = ctx.arc(20.0, -50.0, 6.0, 0.0, TAU);
        let _ = ctx.arc(-20.0, -50.0, 6.0, 0.0, TAU);
        ctx.set_fill_style(&JsValue::from_str("#fff"));
        ctx.fill();

        ctx.begin_path();
        let _ = ctx.arc(22.0, -52.0, 3.0, 0.0, TAU);
        let _ = ctx.arc(-18.0, -52.0, 3.0, 0.0, TAU);
        ctx.set_fill_style(&JsValue::from_str("#000"));
        ctx.fill();

        ctx.set_fill_style(&JsValue::from_str("#e88"));
        ctx.begin_path();
        let _ = ctx.arc(0.0, -20.0, 10.0, 0.0, TAU);
        ctx.fill();

        ctx.set_font("bold 14px monospace");
        ctx.set_text_align("center");
        ctx.set_fill_style(&JsValue::from_str("#fff"));
        let _ = ctx.fill_text(&format!("Lv{} {}", mon.level, mon.name), 0.0, 60.0);

        ctx.restore();
    }

    fn draw_hp_bar(&self, ctx: &CanvasRenderingContext2d, mon: &Pokemon, x: f64, y: f64, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("#333"));
        ctx.fill_rect(x - 2.0, y - 2.0, w + 4.0, h + 4.0);

        let ratio = (mon.hp / mon.max_hp).max(0.0);
        let color = if ratio > 0.5 { "#4ade80" } else if ratio > 0.25 { "#facc15" } else { "#ef4444" };

        ctx.set_fill_style(&JsValue::from_str(color));
        ctx.fill_rect(x, y, w * ratio, h);

        ctx.set_font("11px monospace");
        ctx.set_fill_style(&JsValue::from_str("#fff"));
        ctx.set_text_align("left");
        let _ = ctx.fill_text(&format!("{}  HP: {:.0}/{:.0}", mon.name, mon.hp, mon.max_hp), x, y - 4.0);
    }

    fn draw_log(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        let y0 = h * 0.68;
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.7)"));
        ctx.fill_rect(0.0, y0, w, h * 0.12);

        ctx.set_font("13px monospace");
        ctx.set_fill_style(&JsValue::from_str("#ccc"));
        ctx.set_text_align("left");

        let visible: Vec<&str> = self.log.iter().rev().take(2).rev().map(|s| s.as_str()).collect();
        for (i, line) in visible.iter().enumerate() {
            let _ = ctx.fill_text(line, 16.0, y0 + 18.0 + i as f64 * 18.0);
        }
    }

    fn draw_footer(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.8)"));
        ctx.fill_rect(0.0, h * 0.80, w, h * 0.20);

        ctx.set_stroke_style(&JsValue::from_str("#333"));
        ctx.set_line_width(1.0);
        ctx.begin_path();
        ctx.move_to(0.0, h * 0.80);
        ctx.line_to(w, h * 0.80);
        ctx.stroke();

        let y0 = h * 0.82;
        ctx.set_font("12px monospace");
        ctx.set_text_align("left");
        ctx.set_fill_style(&JsValue::from_str("#888"));
        let _ = ctx.fill_text("React action buttons below ↑", 16.0, y0 + 14.0);
    }

    fn draw_gameover(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.6)"));
        ctx.fill_rect(0.0, 0.0, w, h);

        ctx.set_font("bold 36px monospace");
        ctx.set_text_align("center");
        ctx.set_fill_style(&JsValue::from_str("#fff"));
        let msg = match self.winner {
            Some(w) if w == self.player.name => "You Win!",
            _ => "You Lose...",
        };
        let _ = ctx.fill_text(msg, w / 2.0, h / 2.0 - 10.0);

        ctx.set_font("16px monospace");
        ctx.set_fill_style(&JsValue::from_str("#aaa"));
        let _ = ctx.fill_text("Press back to return to menu", w / 2.0, h / 2.0 + 30.0);
    }
}

fn serde_json_to_string(s: &str) -> String {
    let escaped = s
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t");
    format!("\"{}\"", escaped)
}
