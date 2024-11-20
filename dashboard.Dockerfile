FROM node:18-alpine AS builder
WORKDIR /app

# 清理已存在的 node_modules（如果有的话）
RUN rm -rf node_modules

# 复制 package.json 文件
COPY package*.json ./
COPY packages/dashboard/package*.json ./packages/dashboard/

# 切换到 dashboard 目录并安装依赖
WORKDIR /app/packages/dashboard
RUN rm -rf node_modules && npm install

# 复制源代码（确保 .dockerignore 正确配置）
COPY packages/dashboard ./

# 构建应用
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=builder /app/packages/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 