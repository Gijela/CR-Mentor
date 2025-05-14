# 使用node:21-alpine作为基础镜像
FROM node:21-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json
COPY package.json ./

# 安装pnpm和项目依赖
RUN npm install -g pnpm
RUN pnpm install

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN pnpm build

# 暴露端口
EXPOSE 4000

# 启动应用
CMD ["pnpm", "start"]
