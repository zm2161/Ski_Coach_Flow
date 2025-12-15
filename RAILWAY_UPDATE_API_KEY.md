# 🚀 Railway 更新 API Key - 立即操作指南

## ⚠️ 当前问题

Railway 日志显示：`API key expired. Please renew the API key.`

这说明 Railway 上仍在使用**旧的过期 API key**。

## ✅ 新 API Key

```
AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8
```

## 📝 步骤（必须按顺序执行）

### 步骤 1: 打开 Railway Dashboard

1. 访问：https://railway.app/dashboard
2. 登录您的账号
3. 找到项目：`skicoachflow-production`（或您的项目名）

### 步骤 2: 进入服务设置

1. 点击您的**服务（Service）**（不是项目名称）
2. 点击 **"Variables"** 标签（在顶部菜单栏）

### 步骤 3: 更新环境变量

**方法 A: 编辑现有变量**
1. 找到 `GEMINI_API_KEY`
2. 点击右侧的**编辑图标**（铅笔图标）
3. 删除旧值
4. 粘贴新值：`AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8`
5. **不要加引号**
6. 点击 **"Save"** 或 **"Update"**

**方法 B: 删除后重新添加（如果编辑不工作）**
1. 找到 `GEMINI_API_KEY`
2. 点击右侧的**删除图标**（垃圾桶图标）
3. 点击 **"New Variable"** 按钮
4. **变量名**：`GEMINI_API_KEY`
5. **值**：`AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8`
6. **不要加引号**
7. 点击 **"Add"**

### 步骤 4: 重新部署（⚠️ 必须！）

**重要**：更新环境变量后，**必须重新部署**才能生效！

1. 点击 **"Deployments"** 标签（在顶部菜单栏）
2. 找到最新的部署（最上面的）
3. 点击右侧的 **"..."** 菜单（三个点）
4. 选择 **"Redeploy"**
5. 或者直接点击 **"Redeploy"** 按钮（如果有）

### 步骤 5: 等待部署完成

1. 部署通常需要 1-3 分钟
2. 您会看到部署进度
3. 等待状态变为 **"Success"** 或 **"Active"**

### 步骤 6: 验证 API Key 已加载

1. 点击 **"Logs"** 标签
2. 查找服务器启动日志
3. 应该看到：
   ```
   GEMINI_API_KEY length: 39
   GEMINI_API_KEY exists: true
   [Gemini] ✅ GEMINI_API_KEY loaded successfully
   ```
4. **不应该**看到：
   - `API key expired`
   - `API_KEY_INVALID`
   - `GEMINI_API_KEY length: 0`

### 步骤 7: 测试上传

1. 访问您的 Railway URL：`https://skicoachflow-production.up.railway.app`
2. 上传一个测试视频
3. 应该正常工作，不再出现 API key 错误

## 🚨 常见问题

### Q: 更新后仍然显示 "API key expired"

**可能原因**：
1. ❌ 没有重新部署
2. ❌ 环境变量值有引号或空格
3. ❌ 在项目级别而不是服务级别添加

**解决方案**：
1. ✅ 确保点击了 **"Redeploy"**
2. ✅ 检查值没有引号：`AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8`（正确）
3. ✅ 确保在**服务（Service）**的 Variables 中，不是项目（Project）级别

### Q: 找不到 "Variables" 标签

**解决方案**：
- 确保点击的是**服务（Service）**，不是项目（Project）
- 服务名称通常显示在项目名称下方

### Q: 部署失败

**检查**：
1. 查看 **"Logs"** 标签中的错误信息
2. 确认环境变量格式正确（没有引号）
3. 尝试删除并重新添加环境变量

## ✅ 成功标志

当一切正确后，您应该看到：

**日志中**：
```
GEMINI_API_KEY length: 39
GEMINI_API_KEY exists: true
All env vars starting with GEMINI: [ 'GEMINI_API_KEY' ]
[Gemini] ✅ GEMINI_API_KEY loaded successfully
🚀 Server running on port 8080
```

**功能测试**：
- ✅ 上传视频成功
- ✅ 不再出现 "API key expired" 错误
- ✅ Gemini API 调用成功

## 📸 Railway Dashboard 导航

```
Railway Dashboard
└── Your Project
    └── Your Service (点击这里！)
        ├── Variables (标签) ← 在这里更新
        ├── Deployments (标签) ← 在这里重新部署
        └── Logs (标签) ← 在这里查看日志
```

## 💡 提示

- 环境变量更新后**必须重新部署**才能生效
- 变量名区分大小写：`GEMINI_API_KEY`（全部大写）
- 值不要加引号
- 确保在**服务级别**设置，不是项目级别

---

**完成这些步骤后，API key 错误应该消失！** 🎉

