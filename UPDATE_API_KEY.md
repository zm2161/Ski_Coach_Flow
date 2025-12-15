# 🔑 更新 API Key 指南

## ✅ 本地环境已更新

本地 `.env` 文件已更新为新 API key。

## 🚀 更新 Railway 环境变量

**重要**：您需要在 Railway 中更新环境变量才能使用新 API key。

### 步骤：

1. **打开 Railway Dashboard**
   - 访问 https://railway.app/dashboard
   - 登录您的账号

2. **找到您的服务**
   - 点击项目
   - 点击服务（Service）

3. **更新环境变量**
   - 点击 **"Variables"** 标签
   - 找到 `GEMINI_API_KEY`
   - 点击编辑（或删除后重新添加）
   - 输入新 API key：`AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8`
   - **不要加引号**
   - 点击 **"Save"** 或 **"Add"**

4. **重新部署（必须！）**
   - 点击 **"Deployments"** 标签
   - 找到最新的部署
   - 点击 **"Redeploy"** 按钮
   - 等待部署完成（1-3 分钟）

5. **验证**
   - 部署完成后，查看 **"Logs"** 标签
   - 应该看到：
     ```
     GEMINI_API_KEY length: 39
     [Gemini] ✅ GEMINI_API_KEY loaded successfully
     ```
   - 不应该看到 `API key expired` 错误

## 🧪 测试新 API Key

### 本地测试：
```bash
# 确保 .env 文件已更新
cat .env

# 运行测试脚本
node test-gemini-api.js
```

### Railway 测试：
1. 访问您的 Railway URL
2. 尝试上传一个测试视频
3. 检查是否正常工作

## ⚠️ 重要提示

- ✅ `.env` 文件在 `.gitignore` 中，不会被提交到 Git
- ✅ 新 API key 只存在于本地 `.env` 文件
- ⚠️ **必须**在 Railway 中手动更新环境变量
- ⚠️ 更新环境变量后**必须**重新部署

## 🔒 安全提醒

- ❌ 不要在代码中硬编码 API key
- ❌ 不要在文档中写入真实的 API key
- ❌ 不要在 GitHub Issues/PR 中分享 API key
- ✅ 使用环境变量存储 API key
- ✅ 确保 `.env` 在 `.gitignore` 中

