---
title: Docker Compose
tags:
  - Docker
  - Compose
date: 2026-01-16
order: 4
---

> [What is Docker Compose? | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/)

[[docker/concept/container|容器]]的一个最佳实践**每个容器应该只做一件事**。当你需要启动多个容器来搭建一个复杂系统时，你很快就会意识到，你需要管理网络、将容器连接到这些网络所需的所有标志，以及更多内容。而且当你完成操作后，清理工作也会非常复杂。

==Docker Compose 是一个声明式工具，可以让你使用 YAML 文件来配置应用程序的服务、网络和卷，然后使用一个命令来启动和停止应用程序。==

你只需对其进行定义，然后就能直接使用。你并不总是需要从头开始重新创建所有内容。如果你进行了更改，再次运行 docker compose up，Compose 就会协调你文件中的更改并智能地应用它们。

示例: [Example to-do List Application](https://github.com/dockersamples/todo-list-app)

```yaml fold="docker-compose.yml"
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 127.0.0.1:3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

疑问：Docker Compose 和 Dockerfile 的区别是什么？