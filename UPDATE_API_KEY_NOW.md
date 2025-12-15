# 🔑 立即更新 API Key

## ✅ 新 API Key
```
AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8
```

## 📝 需要更新的地方

### 1. 本地 .env 文件（手动更新）

打开 `.env` 文件，更新为：
```
GEMINI_API_KEY=AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8
```

**或者运行命令**：
```bash
echo "GEMINI_API_KEY=AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8" > .env
```

### 2. Railway 环境变量（必须！）

1. **打开 Railway Dashboard**
   - https://railway.app/dashboard
   - 找到您的服务

2. **更新环境变量**
   - 点击 **"Variables"** 标签
   - 找到 `GEMINI_API_KEY`
   - 点击编辑
   - 更新值为：`AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8`
   - **不要加引号**
   - 保存

3. **重新部署（必须！）**
   - 点击 **"Deployments"** 标签
   - 点击 **"Redeploy"** 按钮
   - 等待部署完成

4. **验证**
   - 查看 **"Logs"** 标签
   - 应该看到：`GEMINI_API_KEY length: 39`
   - 应该看到：`[Gemini] ✅ GEMINI_API_KEY loaded successfully`

## 🧪 测试

### 本地测试：
```bash
# 更新 .env 后测试
node test-gemini-api.js
```

### Railway 测试：
- 访问您的 Railway URL
- 上传测试视频
- 应该不再出现 "API key expired" 错误

## ⚠️ 重要

- ✅ `.env` 文件不会被提交到 Git（已在 .gitignore 中）
- ⚠️ **必须**在 Railway 中更新环境变量
- ⚠️ 更新后**必须**重新部署才能生效

