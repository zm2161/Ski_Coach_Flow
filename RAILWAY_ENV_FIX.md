# 🔧 Railway 环境变量问题修复指南

## 问题：`[Gemini] No GEMINI_API_KEY set`

如果您在 Railway 上添加了 `GEMINI_API_KEY` 但仍然看到这个错误，请按照以下步骤排查：

---

## ✅ 解决方案

### 步骤 1: 确认环境变量已添加

1. 在 Railway Dashboard 中打开您的服务
2. 点击 **"Variables"** 标签
3. 确认 `GEMINI_API_KEY` 存在
4. **检查值是否正确**（没有多余空格、引号等）

**正确的格式**：
```
变量名: GEMINI_API_KEY
值: AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8
```

**错误的格式**（不要这样做）：
```
值: "AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8"  ❌ (不要加引号)
值: AIzaSyCuDjpraog5HXVhNTDi20_GvK8PZqxIvj8   ✅ (正确)
```

### 步骤 2: 重新部署服务

**重要**：添加或修改环境变量后，必须重新部署才能生效！

#### 方法 1: 自动重新部署（推荐）
1. 在 Railway Dashboard 中打开您的服务
2. 点击 **"Deployments"** 标签
3. 点击最新的部署右侧的 **"..."** 菜单
4. 选择 **"Redeploy"**

#### 方法 2: 触发新部署
- 推送任何代码更改到 GitHub（Railway 会自动部署）
- 或者手动点击 **"Redeploy"** 按钮

### 步骤 3: 验证环境变量已加载

部署完成后，查看日志：

1. 在 Railway Dashboard 中打开您的服务
2. 点击 **"Logs"** 标签
3. 查找以下日志行：
   ```
   GEMINI_API_KEY length: 39
   ```
   （数字应该是您的 API key 的长度，通常是 39）

如果看到 `GEMINI_API_KEY length: 0`，说明环境变量没有正确加载。

---

## 🔍 详细排查步骤

### 检查 1: 环境变量名称

确保变量名**完全匹配**（区分大小写）：
- ✅ `GEMINI_API_KEY` （正确）
- ❌ `gemini_api_key` （错误）
- ❌ `GEMINI-API-KEY` （错误）
- ❌ `GEMINI_API_KEY_` （错误）

### 检查 2: 环境变量值

1. 复制您的 API key
2. 在 Railway Variables 中粘贴
3. **不要添加任何引号、空格或换行**
4. 点击 **"Add"** 或 **"Update"**

### 检查 3: 重新部署

即使环境变量看起来正确，也必须重新部署：

1. 在 Railway Dashboard 中
2. 打开您的服务
3. 点击 **"Deployments"** 标签
4. 找到最新的部署
5. 点击 **"Redeploy"** 按钮
6. 等待部署完成（通常 1-3 分钟）

### 检查 4: 查看日志

部署完成后，立即查看日志：

1. 点击 **"Logs"** 标签
2. 查找服务器启动日志
3. 应该看到：
   ```
   GEMINI_API_KEY length: 39
   🚀 Server running on port 3000
   ```

如果看到：
```
GEMINI_API_KEY length: 0
[Gemini] No GEMINI_API_KEY set
```

说明环境变量仍未加载，请：
1. 再次检查变量名和值
2. 删除并重新添加环境变量
3. 重新部署

---

## 🚨 常见错误

### 错误 1: 添加了引号
```
值: "AIzaSy..."  ❌
```
**修复**：删除引号，只保留 API key 本身

### 错误 2: 变量名拼写错误
```
变量名: GEMINI_API_KEYS  ❌ (多了个 S)
变量名: GEMINI-API-KEY   ❌ (用了连字符)
```
**修复**：确保是 `GEMINI_API_KEY`（下划线，单数）

### 错误 3: 没有重新部署
添加环境变量后直接测试，没有重新部署
**修复**：必须点击 **"Redeploy"** 才能生效

### 错误 4: 在错误的服务中添加
在项目级别添加而不是服务级别
**修复**：确保在**服务（Service）**的 Variables 中添加，不是项目（Project）级别

---

## 📝 快速检查清单

- [ ] 环境变量名是 `GEMINI_API_KEY`（完全匹配）
- [ ] 环境变量值是正确的 API key（39 个字符）
- [ ] 值中没有引号、空格或换行
- [ ] 在**服务级别**添加（不是项目级别）
- [ ] 添加后点击了 **"Redeploy"**
- [ ] 部署完成后查看日志，确认 `GEMINI_API_KEY length: 39`

---

## 🎯 如果仍然不行

如果按照以上步骤仍然无法解决问题：

1. **删除环境变量并重新添加**
   - 在 Railway Variables 中删除 `GEMINI_API_KEY`
   - 重新添加（确保名称和值都正确）
   - 重新部署

2. **检查 API key 是否有效**
   - 确认 API key 没有过期
   - 确认 API key 有正确的权限

3. **查看完整日志**
   - 在 Railway Logs 中查看所有错误信息
   - 查找是否有其他相关错误

4. **联系支持**
   - 如果以上都不行，可能是 Railway 平台问题
   - 可以尝试删除服务并重新创建

---

## ✅ 成功标志

当环境变量正确加载后，您应该看到：

1. **日志中显示**：
   ```
   GEMINI_API_KEY length: 39
   🚀 Server running on port 3000
   ```

2. **没有警告**：
   - 不应该看到 `[Gemini] No GEMINI_API_KEY set`

3. **API 调用成功**：
   - 上传视频后，应该能正常调用 Gemini API
   - 不会出现 API key 相关的错误

---

## 💡 提示

- Railway 的环境变量是**区分大小写**的
- 环境变量在**服务级别**设置，不是项目级别
- **每次修改环境变量后都必须重新部署**
- 可以在 Railway Logs 中实时查看环境变量是否加载成功

