# Flo 部署指南

## 架构说明

- **前端**: 部署在 Vercel
- **后端**: 运行在本地，通过 ngrok 暴露为公网 URL
- **FFmpeg**: 在本地运行，处理速度快且免费

## 部署步骤

### 1. 启动本地后端服务器

```bash
# 安装依赖（如果还没安装）
npm install

# 启动服务器
node server.js
```

服务器会在 `http://localhost:3000` 启动。

### 2. 启动 ngrok 暴露后端

在另一个终端窗口运行：

```bash
npx ngrok http 3000
```

ngrok 会显示一个公网 URL，例如：
```
Forwarding  https://xxxxx.ngrok-free.app -> http://localhost:3000
```

**重要**: 复制这个 `https://xxxxx.ngrok-free.app` URL。

### 3. 部署前端到 Vercel

#### 方法 1: 使用 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 在项目根目录运行
vercel

# 按照提示完成部署
```

#### 方法 2: 使用 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 导入你的 GitHub 仓库
3. 配置：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (留空)
   - **Output Directory**: `public`

### 4. 配置前端访问后端

访问你的 Vercel 部署 URL，并在 URL 中添加 `apiBase` 参数：

```
https://your-vercel-app.vercel.app/?apiBase=https://xxxxx.ngrok-free.app
```

**注意**: 
- 确保 ngrok URL 包含 `https://` 协议
- 如果 URL 没有协议，前端会自动添加 `https://`
- API_BASE 会被保存到 localStorage，下次访问会自动使用

### 5. 测试上传功能

1. 访问配置好的 Vercel URL
2. 选择运动项目（双板/单板）
3. 选择地形
4. 上传视频
5. 检查浏览器控制台（F12）查看上传进度和错误信息

## 故障排查

### 问题：上传失败，显示"获取上传链接失败"

**可能原因**:
1. ngrok URL 格式不正确
2. CORS 配置问题
3. ngrok 浏览器警告页面

**解决方案**:
1. 检查 ngrok URL 是否正确，确保包含 `https://`
2. 检查后端服务器是否正在运行
3. 检查浏览器控制台的错误信息
4. 确保 URL 参数格式：`?apiBase=https://xxxxx.ngrok-free.app`

### 问题：CORS 错误

后端已经配置了 CORS，允许所有 Vercel 域名访问。如果仍有问题：

1. 检查 `server.js` 中的 CORS 配置
2. 确保后端服务器正在运行
3. 检查 ngrok 是否正常工作

### 问题：ngrok 浏览器警告

代码已经自动处理 ngrok 的浏览器警告。如果仍然看到警告页面：

1. 检查前端代码是否正确添加了 `ngrok-skip-browser-warning` header
2. 手动访问 ngrok URL 并点击 "Visit Site" 按钮

### 问题：视频无法播放

1. 检查 `analyze.js` 是否正确使用 `apiBase` 构建视频 URL
2. 检查后端 `/uploads` 路由是否正常工作
3. 检查视频文件是否成功上传到本地 `uploads/` 目录

## 开发模式

本地开发时，可以直接访问 `http://localhost:3000`，不需要 ngrok。

## 环境变量

后端需要 `.env` 文件：

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

## 注意事项

1. **ngrok 免费版限制**: 
   - URL 每次重启会变化
   - 有连接数限制
   - 建议使用 ngrok 付费版获得固定域名

2. **文件大小限制**:
   - 默认最大 100MB
   - 可在 `server.js` 中调整

3. **服务器保持运行**:
   - 确保本地服务器和 ngrok 保持运行
   - 可以使用 `pm2` 或 `screen` 保持后台运行

