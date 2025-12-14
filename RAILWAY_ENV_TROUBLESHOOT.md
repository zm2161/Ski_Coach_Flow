# 🔧 Railway 环境变量问题 - 快速修复

## 当前问题
日志显示：`[Gemini] No GEMINI_API_KEY set`

即使您已经在 Railway 设置了环境变量，但服务器没有读取到。

---

## ✅ 立即检查清单

### 1. 确认环境变量位置

**重要**：环境变量必须在**服务（Service）级别**设置，不是项目（Project）级别！

**正确的位置**：
1. Railway Dashboard → 您的项目
2. 点击**服务（Service）**（不是项目名称）
3. 点击 **"Variables"** 标签
4. 在这里添加 `GEMINI_API_KEY`

**错误的位置**：
- ❌ 在项目（Project）级别的 Variables
- ❌ 在 Settings 中

### 2. 确认环境变量名称和值

**变量名**（必须完全匹配，区分大小写）：
```
GEMINI_API_KEY
```

**变量值**（不要加引号）：
```
YOUR_GEMINI_API_KEY_HERE
```

**检查**：
- ✅ 变量名：`GEMINI_API_KEY`（大写，下划线）
- ✅ 值：39 个字符的 API key（没有引号）
- ❌ 不要有前导或尾随空格
- ❌ 不要加引号

### 3. 重新部署（必须！）

**关键步骤**：添加或修改环境变量后，必须重新部署！

**方法 1：手动重新部署**
1. Railway Dashboard → 您的服务
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** 菜单
5. 选择 **"Redeploy"**
6. 等待部署完成（1-3 分钟）

**方法 2：触发新部署**
- 推送任何代码更改到 GitHub
- Railway 会自动重新部署

### 4. 验证环境变量已加载

部署完成后，查看日志：

1. Railway Dashboard → 您的服务
2. 点击 **"Logs"** 标签
3. 查找以下日志：

**成功标志**：
```
GEMINI_API_KEY length: 39
GEMINI_API_KEY exists: true
All env vars starting with GEMINI: [ 'GEMINI_API_KEY' ]
[Gemini] ✅ GEMINI_API_KEY loaded successfully
```

**失败标志**：
```
GEMINI_API_KEY length: 0
GEMINI_API_KEY exists: false
All env vars starting with GEMINI: []
[Gemini] ⚠️ No GEMINI_API_KEY set
```

---

## 🔍 详细排查步骤

### 步骤 1: 检查环境变量设置

1. 打开 Railway Dashboard
2. 进入您的**服务（Service）**（不是项目）
3. 点击 **"Variables"** 标签
4. 确认 `GEMINI_API_KEY` 存在
5. 点击编辑，检查：
   - 名称：`GEMINI_API_KEY`（完全匹配）
   - 值：39 个字符，没有引号

### 步骤 2: 删除并重新添加（如果已存在）

如果环境变量已存在但仍不工作：

1. 删除现有的 `GEMINI_API_KEY`
2. 点击 **"New Variable"**
3. 名称：`GEMINI_API_KEY`
4. 值：粘贴您的 API key（不要加引号）
5. 点击 **"Add"**

### 步骤 3: 重新部署

**必须执行**：
1. 点击 **"Deployments"** 标签
2. 点击最新部署的 **"Redeploy"** 按钮
3. 等待部署完成

### 步骤 4: 检查日志

部署完成后，立即查看日志：

1. 点击 **"Logs"** 标签
2. 查找服务器启动日志
3. 应该看到：
   ```
   GEMINI_API_KEY length: 39
   GEMINI_API_KEY exists: true
   [Gemini] ✅ GEMINI_API_KEY loaded successfully
   ```

---

## 🚨 常见错误

### 错误 1: 在项目级别添加
- ❌ 在项目（Project）的 Variables 中添加
- ✅ 必须在服务（Service）的 Variables 中添加

### 错误 2: 变量名拼写错误
- ❌ `GEMINI_API_KEYS`（多了 S）
- ❌ `gemini_api_key`（小写）
- ❌ `GEMINI-API-KEY`（连字符）
- ✅ `GEMINI_API_KEY`（正确）

### 错误 3: 值有引号或空格
- ❌ `"YOUR_API_KEY"`（不要加引号）
- ❌ ` YOUR_API_KEY `（前后有空格）
- ✅ `YOUR_API_KEY`（正确）

### 错误 4: 没有重新部署
- 添加环境变量后直接测试
- ✅ 必须点击 **"Redeploy"** 才能生效

---

## 📸 Railway Dashboard 截图指南

### 正确的环境变量设置位置：

```
Railway Dashboard
└── Your Project
    └── Your Service (点击这里！)
        └── Variables (标签)
            └── GEMINI_API_KEY = YOUR_GEMINI_API_KEY_HERE
```

### 重新部署位置：

```
Railway Dashboard
└── Your Project
    └── Your Service
        └── Deployments (标签)
            └── Latest Deployment
                └── ... (菜单)
                    └── Redeploy
```

---

## ✅ 成功验证

当一切正确后，您应该看到：

**日志输出**：
```
GEMINI_API_KEY length: 39
GEMINI_API_KEY exists: true
All env vars starting with GEMINI: [ 'GEMINI_API_KEY' ]
[Gemini] ✅ GEMINI_API_KEY loaded successfully
🚀 Server running on port 8080
📡 CORS enabled for Vercel frontend
🎬 FFmpeg available: Yes
```

**没有这些错误**：
- ❌ `[Gemini] No GEMINI_API_KEY set`
- ❌ `GEMINI_API_KEY length: 0`

---

## 🆘 如果仍然不行

如果按照以上步骤仍然无法解决问题：

1. **完全删除服务并重新创建**
   - 删除当前服务
   - 从 GitHub 重新部署
   - 在服务级别添加环境变量
   - 重新部署

2. **检查 API key 是否有效**
   - 确认 API key 没有过期
   - 确认 API key 格式正确（39 个字符）

3. **联系 Railway 支持**
   - 如果以上都不行，可能是平台问题

---

## 💡 重要提示

- **环境变量在服务级别设置**，不是项目级别
- **每次修改环境变量后必须重新部署**
- **变量名区分大小写**：`GEMINI_API_KEY`
- **值不要加引号**
- **查看日志确认环境变量已加载**

