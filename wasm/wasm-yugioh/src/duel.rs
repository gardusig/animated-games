use wasm_bindgen::JsValue;
use web_sys::CanvasRenderingContext2d;

pub struct MonsterCard {
    pub name: &'static str,
    pub atk: u32,
    pub def: u32,
    pub level: u32,
    pub color: &'static str,
}

pub struct Anim {
    pub kind: AnimKind,
    pub timer: f64,
    pub duration: f64,
}

#[allow(dead_code)]
pub enum AnimKind {
    None,
    PlayerSummon,
    EnemySummon,
    PlayerAttack,
    EnemyAttack,
    DamageFlash,
}

pub enum Phase {
    Intro,
    PlayerTurn,
    EnemyTurn,
    BattleAnim,
    GameOver,
}

pub struct Duel {
    pub player_lp: f64,
    pub enemy_lp: f64,
    pub player_monster: Option<MonsterCard>,
    pub enemy_monster: Option<MonsterCard>,
    pub phase: Phase,
    pub anim: Anim,
    pub log: Vec<String>,
    pub winner: Option<&'static str>,
    pub turn: u32,
}

impl Duel {
    pub fn new() -> Self {
        Duel {
            player_lp: 4000.0,
            enemy_lp: 4000.0,
            player_monster: None,
            enemy_monster: None,
            phase: Phase::Intro,
            anim: Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 },
            log: vec!["Duel Start!".to_string(), "Draw your cards!".to_string()],
            winner: None,
            turn: 1,
        }
    }

    pub fn tick(&mut self, dt: f64) {
        self.anim.timer += dt;

        match self.phase {
            Phase::Intro => {
                if self.anim.timer >= 1.5 {
                    self.spawn_monsters();
                    self.anim = Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 };
                    self.phase = Phase::PlayerTurn;
                }
            }
            Phase::BattleAnim => {
                if self.anim.timer >= self.anim.duration {
                    self.anim = Anim { kind: AnimKind::None, timer: 0.0, duration: 0.0 };

                    if self.enemy_lp <= 0.0 || self.player_lp <= 0.0 {
                        self.winner = if self.enemy_lp <= 0.0 { Some("Player") } else { Some("Enemy") };
                        self.log.push(format!("{} wins the duel!", self.winner.unwrap()));
                        self.phase = Phase::GameOver;
                    } else if matches!(self.phase, Phase::BattleAnim) {
                        self.phase = Phase::PlayerTurn;
                    }
                }
            }
            Phase::GameOver | Phase::PlayerTurn | Phase::EnemyTurn => {}
        }

        if matches!(self.phase, Phase::EnemyTurn) {
            self.phase = Phase::PlayerTurn;
        }
    }

    fn spawn_monsters(&mut self) {
        self.player_monster = Some(MonsterCard {
            name: "Dark Magician",
            atk: 2500,
            def: 2100,
            level: 7,
            color: "#9b59b6",
        });
        self.enemy_monster = Some(MonsterCard {
            name: "Blue-Eyes White Dragon",
            atk: 3000,
            def: 2500,
            level: 8,
            color: "#3498db",
        });
        self.log.push("Player: Dark Magician (2500 ATK)".to_string());
        self.log.push("Enemy: Blue-Eyes White Dragon (3000 ATK)".to_string());
    }

    pub fn select_action(&mut self, index: usize) {
        if !matches!(self.phase, Phase::PlayerTurn) {
            return;
        }

        match index {
            0 => self.player_attack(),
            1 => self.defend(),
            2 => self.pass_turn(),
            _ => {}
        }
    }

    fn player_attack(&mut self) {
        let Some(ref monster) = self.player_monster else { return };
        let Some(ref enemy) = self.enemy_monster else { return };

        self.log.push(format!("{} attacks!", monster.name));
        let dmg = monster.atk.saturating_sub(enemy.def) as f64;
        if dmg > 0.0 {
            self.enemy_lp = (self.enemy_lp - dmg).max(0.0);
            self.log.push(format!("{} LP! ({:.0} damage)", if self.enemy_lp > 0.0 { "Enemy loses" } else { "Enemy defeated" }, dmg));
        } else {
            let rebound = enemy.atk.saturating_sub(monster.def) as f64;
            self.player_lp = (self.player_lp - rebound).max(0.0);
            self.log.push(format!("Attack rebounded! Player loses {:.0} LP", rebound));
        }

        self.anim = Anim { kind: AnimKind::PlayerAttack, timer: 0.0, duration: 0.5 };
        self.phase = Phase::BattleAnim;

        if self.log.len() > 20 {
            self.log.remove(0);
        }
    }

    fn defend(&mut self) {
        self.log.push("Player switches to defense position.".to_string());
        if self.log.len() > 20 { self.log.remove(0); }
    }

    fn pass_turn(&mut self) {
        self.turn += 1;
        self.log.push(format!("Turn {}", self.turn));
        self.enemy_turn();
    }

    fn enemy_turn(&mut self) {
        self.anim = Anim { kind: AnimKind::EnemyAttack, timer: 0.0, duration: 0.8 };
        self.phase = Phase::BattleAnim;

        let Some(ref monster) = self.player_monster else { return };
        let Some(ref enemy) = self.enemy_monster else { return };

        self.log.push(format!("Enemy attacks with {}!", enemy.name));
        let dmg = enemy.atk.saturating_sub(monster.def) as f64;
        if dmg > 0.0 {
            self.player_lp = (self.player_lp - dmg).max(0.0);
            self.log.push(format!("Player loses {:.0} LP!", dmg));
        } else {
            self.log.push("Player's monster blocked the attack!".to_string());
        }
    }

    pub fn state_json(&self) -> String {
        let phase_str = match self.phase {
            Phase::Intro => "intro",
            Phase::PlayerTurn => "select",
            Phase::EnemyTurn => "enemy",
            Phase::BattleAnim => "anim",
            Phase::GameOver => "gameover",
        };

        let monster_json = |m: &Option<MonsterCard>| -> String {
            match m {
                Some(c) => format!(r#"{{"name":"{}","atk":{},"def":{},"level":{}}}"#, c.name, c.atk, c.def, c.level),
                None => "null".to_string(),
            }
        };

        let visible: Vec<&str> = self.log.iter().rev().take(3).rev().map(|s| s.as_str()).collect();
        let log_json: Vec<String> = visible.iter().map(|s| json_escape(s)).collect();

        format!(
            r#"{{"phase":"{}","playerLp":{},"enemyLp":{},"playerMonster":{},"enemyMonster":{},"turn":{},"log":[{}],"winner":{}}}"#,
            phase_str,
            self.player_lp,
            self.enemy_lp,
            monster_json(&self.player_monster),
            monster_json(&self.enemy_monster),
            self.turn,
            log_json.join(","),
            match self.winner {
                Some(w) => format!(r#""{}""#, w),
                None => "null".to_string(),
            }
        )
    }

    pub fn draw(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("#0d0d1a"));
        ctx.fill_rect(0.0, 0.0, w, h);

        self.draw_field(ctx, w, h);
        self.draw_lp_display(ctx, w, h);

        if let Some(ref monster) = self.enemy_monster {
            self.draw_monster_card(ctx, monster, w * 0.5, h * 0.2);
        }
        if let Some(ref monster) = self.player_monster {
            self.draw_monster_card(ctx, monster, w * 0.5, h * 0.55);
        }

        self.draw_log(ctx, w, h);
        self.draw_footer(ctx, w, h);

        if matches!(self.phase, Phase::GameOver) {
            self.draw_gameover(ctx, w, h);
        }
    }

    fn draw_field(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_stroke_style(&JsValue::from_str("#1a1a3e"));
        ctx.set_line_width(2.0);

        let mid = h / 2.0;
        ctx.begin_path();
        ctx.move_to(0.0, mid);
        ctx.line_to(w, mid);
        ctx.stroke();

        for &(cx, cy) in &[(w * 0.3, h * 0.2), (w * 0.7, h * 0.2), (w * 0.3, h * 0.55), (w * 0.7, h * 0.55)] {
            ctx.stroke_rect(cx - 55.0, cy - 40.0, 110.0, 80.0);
        }
    }

    fn draw_lp_display(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_font("bold 18px monospace");
        ctx.set_text_align("center");

        ctx.set_fill_style(&JsValue::from_str("#ef4444"));
        let _ = ctx.fill_text(&format!("Enemy LP: {:.0}", self.enemy_lp), w * 0.85, h * 0.08);

        ctx.set_fill_style(&JsValue::from_str("#4ade80"));
        let _ = ctx.fill_text(&format!("Player LP: {:.0}", self.player_lp), w * 0.85, h * 0.92);

        ctx.set_fill_style(&JsValue::from_str("#666"));
        ctx.set_font("12px monospace");
        let _ = ctx.fill_text(&format!("Turn {}", self.turn), w * 0.5, h * 0.50);
    }

    fn draw_monster_card(&self, ctx: &CanvasRenderingContext2d, card: &MonsterCard, cx: f64, cy: f64) {
        ctx.save();
        ctx.translate(cx, cy).unwrap();

        ctx.set_fill_style(&JsValue::from_str(card.color));
        ctx.fill_rect(-50.0, -35.0, 100.0, 70.0);

        ctx.set_stroke_style(&JsValue::from_str("#fff"));
        ctx.set_line_width(2.0);
        ctx.stroke_rect(-50.0, -35.0, 100.0, 70.0);

        ctx.set_fill_style(&JsValue::from_str("#fff"));
        ctx.set_font("bold 10px monospace");
        ctx.set_text_align("center");
        let _ = ctx.fill_text(card.name, 0.0, -18.0);

        ctx.set_font("10px monospace");
        let _ = ctx.fill_text(&format!("Lv{}", card.level), 35.0, -22.0);

        ctx.set_fill_style(&JsValue::from_str("rgba(255,255,255,0.3)"));
        ctx.set_font("9px monospace");
        let _ = ctx.fill_text("ATK", -30.0, -6.0);
        let _ = ctx.fill_text("DEF", -30.0, 8.0);

        ctx.set_fill_style(&JsValue::from_str("#fff"));
        ctx.set_font("bold 11px monospace");
        let _ = ctx.fill_text(&format!("{}", card.atk), -5.0, -6.0);
        let _ = ctx.fill_text(&format!("{}", card.def), -5.0, 8.0);

        let stars = "★".repeat(card.level as usize);
        ctx.set_font("8px monospace");
        ctx.set_fill_style(&JsValue::from_str("#ffd700"));
        let _ = ctx.fill_text(&stars, 0.0, -30.0);

        ctx.restore();
    }

    fn draw_log(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        let y0 = h * 0.70;
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.7)"));
        ctx.fill_rect(0.0, y0, w, h * 0.12);

        ctx.set_font("12px monospace");
        ctx.set_fill_style(&JsValue::from_str("#aaa"));
        ctx.set_text_align("left");

        let visible: Vec<&str> = self.log.iter().rev().take(2).rev().map(|s| s.as_str()).collect();
        for (i, line) in visible.iter().enumerate() {
            let _ = ctx.fill_text(line, 16.0, y0 + 18.0 + i as f64 * 16.0);
        }
    }

    fn draw_footer(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.8)"));
        ctx.fill_rect(0.0, h * 0.82, w, h * 0.18);

        ctx.set_stroke_style(&JsValue::from_str("#333"));
        ctx.set_line_width(1.0);
        ctx.begin_path();
        ctx.move_to(0.0, h * 0.82);
        ctx.line_to(w, h * 0.82);
        ctx.stroke();

        ctx.set_font("12px monospace");
        ctx.set_text_align("left");
        ctx.set_fill_style(&JsValue::from_str("#888"));
        let _ = ctx.fill_text("React action buttons below ↑", 16.0, h * 0.82 + 18.0);
    }

    fn draw_gameover(&self, ctx: &CanvasRenderingContext2d, w: f64, h: f64) {
        ctx.set_fill_style(&JsValue::from_str("rgba(0,0,0,0.6)"));
        ctx.fill_rect(0.0, 0.0, w, h);

        ctx.set_font("bold 36px monospace");
        ctx.set_text_align("center");
        ctx.set_fill_style(&JsValue::from_str("#fff"));
        let msg = match self.winner {
            Some(w) if w == &"Player" => "You Win!",
            _ => "You Lose...",
        };
        let _ = ctx.fill_text(msg, w / 2.0, h / 2.0 - 10.0);

        ctx.set_font("16px monospace");
        ctx.set_fill_style(&JsValue::from_str("#aaa"));
        let _ = ctx.fill_text("Press back to return to menu", w / 2.0, h / 2.0 + 30.0);
    }
}

fn json_escape(s: &str) -> String {
    let escaped = s
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t");
    format!("\"{}\"", escaped)
}
