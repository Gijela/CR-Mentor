# 使用node:21-alpine作为基础镜像
FROM node:21-alpine

# 安装必要的系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    git

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装pnpm和项目依赖
RUN npm install -g pnpm
RUN pnpm install

# 复制项目文件到工作目录
COPY . .

# 如果需要构建项目
RUN pnpm build

# 暴露端口
EXPOSE 4000

# 启动应用
CMD ["pnpm", "start"]
