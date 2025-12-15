# 🚀 AI Builder 部署指南

## 概述

使用 AI Builder MCP 将 Flo 项目部署到 `ai-builders.space` 平台。

## 部署要求

### 1. 技术需求

- ✅ **Dockerfile**：已创建，包含 Node.js 18 和 FFmpeg
- ✅ **单进程/单端口**：Express 服务器同时提供 API 和静态文件
- ✅ **PORT 环境变量**：服务器使用 `process.env.PORT || 8000`
- ✅ **公开 GitHub 仓库**：`https://github.com/zm2161/Ski_Coach_Flow.git`
- ✅ **静态文件服务**：`app.use(express.static('public'))` 已配置

### 2. 环境变量

部署时会自动注入：
- `AI_BUILDER_TOKEN`：自动注入（不需要手动设置）
- `GEMINI_API_KEY`：通过 `deploy-config.json` 传递
- `PORT`：由 Koyeb 自动设置

## 部署步骤

### 步骤 1: 确保代码已提交并推送

```bash
git add .
git commit -m "Add Dockerfile and prepare for AI Builder deployment"
git push origin main
```

### 步骤 2: 检查部署配置

`deploy-config.json` 文件包含：
- **repo_url**: GitHub 仓库 URL
- **service_name**: 服务名称（将成为子域名）
- **branch**: Git 分支（main）
- **port**: 容器端口（8000）
- **env_vars**: 环境变量（包括 GEMINI_API_KEY）

### 步骤 3: 使用 MCP API 部署

部署 API 调用需要：
- **repo_url**: `https://github.com/zm2161/Ski_Coach_Flow.git`
- **service_name**: `flo-ski-coach`（将创建 `https://flo-ski-coach.ai-builders.space`）
- **branch**: `main`
- **port**: `8000`
- **env_vars**: 
  ```json
  {
    "GEMINI_API_KEY": "AIzaSyDbNfWsUx_DzlBE_D91tq4JXs__gXjHy-A",
    "NODE_ENV": "production"
  }
  ```

### 步骤 4: 监控部署状态

部署需要 5-10 分钟。可以通过 API 检查状态：
- 使用 `GET /v1/deployments/{service_name}` 检查状态
- 状态会从 `queued` → `deploying` → `HEALTHY`（成功）或 `ERROR`（失败）

## 部署后的访问

部署成功后，应用将在以下 URL 可用：
```
https://flo-ski-coach.ai-builders.space
```

## 重要说明

### 保留的功能

- ✅ **Gemini API**：完全保留，通过环境变量 `GEMINI_API_KEY` 配置
- ✅ **FFmpeg**：Dockerfile 中已安装
- ✅ **视频上传**：通过 `/api/upload` 端点
- ✅ **静态文件**：前端文件从 `public/` 目录提供

### 限制

- **资源限制**：256 MB RAM（nano 容器）
- **免费期限**：12 个月免费托管
- **服务限制**：每个用户最多 2 个服务（默认）

### 与 Railway 的区别

| 特性 | Railway | AI Builder |
|------|---------|------------|
| 配置文件 | `nixpacks.toml` | `Dockerfile` |
| 默认端口 | 3000 | 8000 |
| 平台 | Railway | Koyeb |
| 域名 | `*.railway.app` | `*.ai-builders.space` |
| 环境变量 | 手动在 Dashboard 设置 | 通过 `env_vars` 传递 |

## 故障排查

### 部署失败

1. **检查 Dockerfile**：确保使用 shell form (`sh -c`) 来扩展 PORT 变量
2. **检查日志**：查看 Koyeb 部署日志中的错误信息
3. **验证代码已推送**：确保所有更改都已提交并推送到 GitHub

### 服务不健康

1. **检查端口**：确保应用监听 `0.0.0.0:${PORT}`
2. **检查环境变量**：确认 `GEMINI_API_KEY` 正确传递
3. **查看日志**：检查应用启动日志

## 下一步

部署完成后：
1. 访问 `https://flo-ski-coach.ai-builders.space`
2. 测试视频上传功能
3. 验证 Gemini API 正常工作

