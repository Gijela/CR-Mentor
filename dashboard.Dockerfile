FROM node:21.7-alpine AS builder
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 并安装依赖
COPY packages/dashboard/package.json ./
RUN pnpm install

# 复制其他源文件
COPY packages/dashboard ./

RUN pnpm run build

FROM nginx:1.24-alpine

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]