# ===== 1. ビルドステージ =====
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ===== 2. デプロイステージ =====
FROM nginx:stable-alpine

# ビルド成果物をコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ←←← これが必要！！！！！
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
