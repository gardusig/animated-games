FROM rust:1.80-slim-bookworm AS build
WORKDIR /src
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release 2>/dev/null || true
COPY src/ src/
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=build /src/target/release/animated-games-backend /server
EXPOSE 8080
CMD ["/server"]
