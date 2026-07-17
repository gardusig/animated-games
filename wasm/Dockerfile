FROM rust:1.80-slim-bookworm AS build
RUN cargo install wasm-pack
WORKDIR /src
COPY . .
RUN for dir in wasm-pokemon wasm-yugioh; do \
      wasm-pack build "$dir" --target web --out-dir /out/"$dir"; \
    done

FROM scratch
COPY --from=build /out /
