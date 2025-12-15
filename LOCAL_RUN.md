# 🚀 本地运行指南

## 快速开始

### 1. 确保依赖已安装

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npm install
```

### 2. 检查环境变量

确保 `.env` 文件存在并包含 API key：

```bash
cat .env
```

应该看到：
```
GEMINI_API_KEY=AIzaSyDbNfWsUx_DzlBE_D91tq4JXs__gXjHy-A
```

### 3. 启动服务器

**方式 1: 普通启动**
```bash
npm start
```

**方式 2: 开发模式（自动重启）**
```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：
```
http://localhost:3000
```

## 预期输出

启动成功后，终端应该显示：

```
============================================================
🔑 GEMINI_API_KEY Fingerprint (for comparison):
   Length: 39
   First 10 chars: AIzaSyDbNf
   Last 10 chars: s__gXjHy-A
   Full fingerprint: AIzaSyDbNf...s__gXjHy-A
============================================================
[Gemini] ✅ GEMINI_API_KEY loaded successfully (NEW KEY - matches expected fingerprint)
🚀 Server running on port 3000
📡 CORS enabled for Vercel frontend
🎬 FFmpeg available: Yes
```

## 使用应用

1. **选择运动类型**：单板 🏂 或 双板 ⛷️
2. **选择地形**：根据实际情况选择
3. **上传视频**：点击或拖拽视频文件（MP4, MOV, AVI, WEBM，最大 100MB）
4. **等待分析**：系统会使用 Gemini AI 分析视频
5. **查看结果**：在分析页面查看教练反馈

## 常见问题

### 端口被占用

如果端口 3000 已被占用：

```bash
# 查看占用端口的进程
lsof -ti:3000

# 杀死进程
lsof -ti:3000 | xargs kill -9

# 或者使用其他端口
PORT=3001 npm start
```

### API Key 错误

如果看到 API key 相关错误：

1. 检查 `.env` 文件是否存在
2. 确认 API key 格式正确（没有引号、没有空格）
3. 运行测试脚本验证：
   ```bash
   node test-list-models.js
   ```

### FFmpeg 未找到

如果看到 FFmpeg 相关错误：

```bash
# macOS
brew install ffmpeg

# 或使用项目自带的
npm install @ffmpeg-installer/ffmpeg
```

## 停止服务器

在运行服务器的终端中按：
```
Ctrl + C
```

## 测试 API Key

在启动服务器前，可以测试 API key：

```bash
node test-list-models.js
```

应该看到：
```
✅ API Key 有效！
📋 找到 X 个可用模型
```

## 开发模式

使用 `npm run dev` 启动开发模式：
- 自动重启（修改代码后）
- 更详细的错误信息
- 需要安装 `nodemon`：`npm install -g nodemon`

