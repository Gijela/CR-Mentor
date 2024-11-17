FROM node:18-alpine as builder
WORKDIR /app

# 复制整个 monorepo
COPY . .

# 复制环境变量文件
COPY .env ./packages/landing-page/.env

RUN npm install -g pnpm && \
    pnpm install && \
    cd packages/landing-page && \
    pnpm build

# 设置工作目录
WORKDIR /app/packages/landing-page

# 暴露端口
EXPOSE 3000

# 启动 Next.js
CMD ["pnpm", "start"] 