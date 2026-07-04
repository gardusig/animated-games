# Launcher — monorepo SPA (game micro-frontends via Vite aliases)
FROM node:20-alpine AS builder
WORKDIR /app
COPY launcher/frontend/package.json launcher/frontend/
WORKDIR /app/launcher/frontend
RUN npm install
COPY launcher/frontend ./
COPY games/yugioh/frontend/src /app/games/yugioh/frontend/src
COPY games/pokemon/frontend/src /app/games/pokemon/frontend/src
RUN npm run build

FROM nginx:alpine
COPY launcher/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/launcher/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
