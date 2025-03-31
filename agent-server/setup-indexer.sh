#!/bin/bash

echo "设置 CodeReviewAgent 依赖..."

# 确保 indexer-searcher 目录存在
if [ ! -d "../indexer-searcher" ]; then
  echo "Error: indexer-searcher 目录不存在!"
  echo "请确保 indexer-searcher 存在于与 agent-server 相同的父目录中"
  exit 1
fi

# 安装 indexer-searcher 依赖并构建
echo "构建 indexer-searcher..."
cd ../indexer-searcher
npm install -g pnpm
pnpm install
pnpm run build
cd ../agent-server

# 安装 agent-server 依赖
echo "安装 agent-server 依赖..."
pnpm install

# 创建索引目录
echo "创建索引目录..."
mkdir -p .index

# 检查是否安装了 symf
if ! command -v symf &> /dev/null; then
  echo "警告: symf 未安装"
  echo "安装 symf (如果需要):"
  echo "npm install -g @sourcegraph/symf"
  echo "或者设置环境变量 SYMF_PATH 指向 symf 可执行文件"
else
  echo "symf 已安装: $(which symf)"
fi

echo "设置完成!"
echo "启动服务: npm run dev" 