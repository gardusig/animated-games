use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[derive(Serialize)]
struct Game {
    id: &'static str,
    name: &'static str,
    description: &'static str,
}

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

const GAMES: &[Game] = &[
    Game {
        id: "pokemon",
        name: "Pok\u{00e9}mon",
        description: "WASM-powered Pok\u{00e9}mon battle simulation",
    },
    Game {
        id: "yugioh",
        name: "Yu-Gi-Oh!",
        description: "High-speed duel animations driven by the Rust WASM engine",
    },
];

async fn handle_games() -> Json<&'static [Game]> {
    Json(GAMES)
}

async fn handle_health() -> Json<Health> {
    Json(Health { status: "ok" })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/games", get(handle_games))
        .route("/api/health", get(handle_health))
        .layer(CorsLayer::permissive());

    let addr: SocketAddr = "0.0.0.0:8080".parse().unwrap();
    println!("backend listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
