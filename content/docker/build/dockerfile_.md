---
title: Dockerfile 
tags: 
  - Docker
  - Dockerfile
date: 2026-01-17
order: 2 
---

> [Writing a Dockerfile | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)

==Dockerfile 是用于创建镜像的文本文档==。它向镜像构建器提供指令，包括要运行的命令、要复制的文件、启动命令等。

:::[!info] 搞清楚[[docker/concept/compose_and_dockerfile|Docker Compose 和 Dockerfile]]
:::

```dockerfile
FROM python:3.13
WORKDIR /usr/local/app

# Install the application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy in the source code
COPY src ./src
EXPOSE 8080

# Setup an app user so the container doesn't run as the root user
RUN useradd app
USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## 常用指令

| 指令 | 描述 |
| :--- | :--- |
| `FROM <image>` | 指定构建将扩展的基础镜像。 |
| `WORKDIR <path>` | 指定“工作目录”，即镜像中复制文件和执行命令的路径。 |
| `COPY <host-path> <image-path>` | 告诉构建器从宿主机复制文件并将其放入容器镜像中。 |
| `RUN <command>` | 告诉构建器运行指定的命令。 |
| `ENV <name> <value>` | 设置运行容器将使用的环境变量。 |
| `EXPOSE <port-number>` | 在镜像上设置配置，指示镜像想要暴露的端口。 |
| `USER <user-or-uid>` | 为所有后续指令设置默认用户。 |
| `CMD ["<command>", "<arg1>"]` | 设置使用此镜像的容器将运行的默认命令。 |
