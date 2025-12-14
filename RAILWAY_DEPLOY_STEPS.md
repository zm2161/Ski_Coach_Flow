# 🚂 Railway 部署步骤指南

本指南将一步步指导您将 Flo 后端部署到 Railway。

## 📋 前置准备

### 1. 确保代码已准备好
- ✅ `server.js` 已适配 Railway（已完成）
- ✅ `nixpacks.toml` 配置正确（Node.js 18 + FFmpeg）
- ✅ `package.json` 有 `start` 脚本

### 2. 准备 GitHub 仓库
- 确保代码已推送到 GitHub
- Railway 需要从 GitHub 仓库部署

---

## 🚀 部署步骤

### 步骤 1: 登录 Railway

1. 访问 [railway.app](https://railway.app)
2. 点击 **"Start a New Project"** 或 **"Login"**
3. 使用 **GitHub 账号登录**（推荐，最简单）

### 步骤 2: 创建新项目

1. 登录后，点击 **"New Project"** 按钮
2. 选择 **"Deploy from GitHub repo"**
3. 如果首次使用，需要授权 Railway 访问您的 GitHub
4. 选择您的仓库（`skiing_coach_cursor` 或您的仓库名）

### 步骤 3: Railway 自动检测

Railway 会自动：
- 检测到 Node.js 项目
- 读取 `nixpacks.toml` 配置
- 开始构建（安装 Node.js 18 和 FFmpeg）

**等待构建完成**（通常 2-5 分钟）

### 步骤 4: 配置环境变量

1. 在 Railway 项目页面，点击您的服务（Service）
2. 打开 **"Variables"** 标签
3. 点击 **"New Variable"** 添加：

   **变量名**: `GEMINI_API_KEY`  
   **值**: `YOUR_GEMINI_API_KEY_HERE`

   （请使用您自己的 Gemini API 密钥）

4. 点击 **"Add"** 保存

### 步骤 5: 获取公共 URL

1. 部署完成后，Railway 会自动生成一个公共 URL
2. 在服务页面，点击 **"Settings"** 标签
3. 找到 **"Generate Domain"** 或查看 **"Networking"** 部分
4. 您会看到一个 URL，格式类似：
   ```
   https://your-app-name.up.railway.app
   ```
5. **复制这个 URL**，稍后需要用到

### 步骤 6: 更新前端配置

现在需要让 Vercel 前端连接到 Railway 后端：

#### 方法 1: 使用 URL 参数（推荐，最简单）

在 Vercel 前端 URL 后添加 `apiBase` 参数：

```
https://traeskiingcoach8oba-naif6t401-jennys-projects-d204687a.vercel.app/?apiBase=https://your-app-name.up.railway.app
```

将 `your-app-name.up.railway.app` 替换为您的实际 Railway URL。

#### 方法 2: 更新 CORS 配置（如果需要）

如果遇到 CORS 错误，可能需要更新 `server.js` 中的 `allowedOrigins` 数组。

---

## ✅ 验证部署

### 1. 检查服务状态

在浏览器访问：
```
https://your-app-name.up.railway.app/api/video/test
```

应该返回：
```json
{"error":"未找到视频"}
```

这是正常的（表示服务器运行正常）。

### 2. 测试 CORS 预检

在终端运行：
```bash
curl -X OPTIONS \
  -H "Origin: https://traeskiingcoach8oba-naif6t401-jennys-projects-d204687a.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  https://your-app-name.up.railway.app/api/upload \
  -I
```

应该返回 `204 No Content` 和 CORS 头。

### 3. 在前端测试上传

1. 访问 Vercel 前端 URL（带 `apiBase` 参数）
2. 上传一个测试视频
3. 检查右上角指示器应为**绿色**
4. 等待分析完成

---

## 🔧 常见问题排查

### Q: 部署失败？

**检查日志**：
1. 在 Railway Dashboard 中打开您的服务
2. 查看 **"Deployments"** 标签
3. 点击失败的部署查看详细日志

**常见原因**：
- 环境变量未设置
- `package.json` 缺少依赖
- 构建超时（通常不会发生）

### Q: FFmpeg 不可用？

**检查**：
- 确保 `nixpacks.toml` 文件存在
- 确保 `nixpacks.toml` 中包含 `ffmpeg`
- 重新部署（Railway 会自动安装 FFmpeg）

### Q: CORS 错误？

**解决方案**：
1. 检查 `server.js` 中的 `allowedOrigins` 数组
2. 确保包含您的 Vercel 前端 URL
3. 如果需要，可以临时允许所有来源：
   ```javascript
   app.use(cors()); // 允许所有来源
   ```

### Q: 端口错误？

**说明**：
- Railway 自动设置 `PORT` 环境变量
- 代码已支持：`const PORT = process.env.PORT || 3000;`
- 无需手动配置

### Q: 环境变量未加载？

**检查**：
1. 在 Railway Dashboard 中打开 **"Variables"** 标签
2. 确保 `GEMINI_API_KEY` 已添加
3. 确保值正确（没有多余空格）
4. 重新部署服务

---

## 📊 监控和管理

### 查看日志

1. 在 Railway Dashboard 中打开您的服务
2. 点击 **"Logs"** 标签
3. 实时查看服务器日志

### 查看指标

Railway 提供：
- CPU 使用率
- 内存使用率
- 网络流量
- 请求数

### 重新部署

**自动部署**：
- 每次推送到 GitHub 主分支，Railway 会自动重新部署

**手动部署**：
1. 在 Railway Dashboard 中
2. 点击 **"Deployments"** 标签
3. 点击 **"Redeploy"** 按钮

---

## 💰 费用说明

Railway 提供：
- **免费额度**: $5/月（通常足够小型项目）
- **按使用付费**: 超出免费额度后按实际使用计费
- **无信用卡要求**: 免费额度内无需绑定信用卡

**估算**：
- 小型项目（偶尔使用）: 通常在免费额度内
- 中等使用: 可能 $5-10/月
- 高流量: 按实际使用计费

---

## 🎉 完成！

部署完成后，您的后端将在 Railway 上运行，前端可以通过 `apiBase` 参数连接到它。

### 下一步

1. ✅ 测试上传功能
2. ✅ 验证视频分析功能
3. ✅ 分享给朋友测试

### 有用的链接

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway 文档**: https://docs.railway.app
- **项目日志**: 在 Railway Dashboard 中查看

---

## 📝 快速参考

### Railway URL 格式
```
https://your-app-name.up.railway.app
```

### 前端访问格式
```
https://your-vercel-app.vercel.app/?apiBase=https://your-app-name.up.railway.app
```

### 环境变量
- `GEMINI_API_KEY`: Google Gemini API 密钥（必需）

### 重要文件
- `nixpacks.toml`: Railway 构建配置
- `server.js`: 后端服务器代码
- `package.json`: Node.js 项目配置

