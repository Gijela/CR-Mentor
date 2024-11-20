docker 镜像加速配置：https://www.coderjia.cn/archives/dba3f94c-a021-468a-8ac6-e840f85867ea

根目录执行 `docker-compose up -d --build` 启动服务

## docker 命令

```bash
# 1. 构建镜像
# -t 参数指定镜像名称和标签
# -f 参数指定 Dockerfile 路径
# 最后的 . 表示构建上下文是当前目录
docker build -t dashboard:latest -f dash.Dockerfile .

# 2. 运行容器
# -d 后台运行
# -p 端口映射，将容器的80端口映射到主机的5173端口
# --name 指定容器名称
docker run -d -p 5173:80 --name dashboard dashboard:latest

# 其他常用命令：
# 查看容器日志
docker logs -f dashboard

# 停止容器
docker stop dashboard

# 删除容器
docker rm dashboard

# 删除镜像
docker rmi dashboard:latest

# 重新构建（如果修改了代码）
docker build --no-cache -t dashboard:latest -f dashboard.Dockerfile .
```
