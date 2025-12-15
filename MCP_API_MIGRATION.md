# 🔄 MCP API 迁移指南

## 概述

已将项目从直接使用 Gemini API 迁移到使用 AI Builder MCP API。现在通过 AI Builder 平台调用 Gemini，不再需要 `GEMINI_API_KEY`。

## ✅ 已完成的更改

### 1. API 客户端初始化

**之前**:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

**现在**:
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({
  baseURL: 'https://space.ai-builders.com/backend/v1',
  apiKey: process.env.AI_BUILDER_TOKEN, // 自动注入
});
```

### 2. API 调用方式

**之前**:
```javascript
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const result = await textModel.generateContent(prompt);
const text = result.response.text();
```

**现在**:
```javascript
const completion = await openai.chat.completions.create({
  model: 'gemini-2.5-pro',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 4096,
});
const text = completion.choices[0]?.message?.content || '';
```

### 3. 环境变量

**之前**:
- 需要 `GEMINI_API_KEY`（Google API key）
- 需要在部署平台手动设置

**现在**:
- 使用 `AI_BUILDER_TOKEN`（自动注入）
- 部署时无需手动配置 API key
- 本地测试时需要在 `.env` 中设置 `AI_BUILDER_TOKEN`

### 4. 依赖包

**移除**:
- `@google/generative-ai`

**添加**:
- `openai` (OpenAI SDK，兼容 AI Builder API)

### 5. 部署配置

**之前** (`deploy-config.json`):
```json
{
  "env_vars": {
    "GEMINI_API_KEY": "...",
    "NODE_ENV": "production"
  }
}
```

**现在**:
```json
{
  "env_vars": {
    "NODE_ENV": "production"
  }
}
```

`AI_BUILDER_TOKEN` 会自动注入，无需在 `env_vars` 中设置。

## 🔧 本地开发设置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在 `.env` 文件中添加：

```env
AI_BUILDER_TOKEN=sk_5cd8ba7f_d128a16e30bfd823186c4a28bd49ea20463d
```

**注意**: 这个 token 来自 MCP 配置 (`~/.cursor/mcp.json`)

### 3. 运行应用

```bash
npm start
```

## 🚀 部署到 AI Builder

部署时，`AI_BUILDER_TOKEN` 会自动注入，无需手动配置。

### 部署步骤

1. **确保代码已提交并推送**:
   ```bash
   git add .
   git commit -m "Migrate to AI Builder MCP API"
   git push origin main
   ```

2. **使用部署配置**:
   - `deploy-config.json` 已更新，移除了 `GEMINI_API_KEY`
   - `AI_BUILDER_TOKEN` 会自动注入

3. **检查部署状态**:
   ```bash
   node check-deployment-status.js
   ```

## 📊 API 对比

| 特性 | Google Generative AI SDK | AI Builder MCP API |
|------|-------------------------|-------------------|
| SDK | `@google/generative-ai` | `openai` (OpenAI SDK) |
| API Key | `GEMINI_API_KEY` | `AI_BUILDER_TOKEN` |
| Base URL | `https://generativelanguage.googleapis.com` | `https://space.ai-builders.com/backend/v1` |
| 模型名称 | `gemini-2.5-flash` | `gemini-2.5-pro` |
| 调用方式 | `generateContent()` | `chat.completions.create()` |
| 响应格式 | `result.response.text()` | `completion.choices[0].message.content` |
| 自动注入 | ❌ 需要手动设置 | ✅ 平台自动注入 |

## ✅ 优势

1. **无需管理 API Key**: `AI_BUILDER_TOKEN` 自动注入
2. **统一认证**: 使用同一个 token 访问所有 AI Builder 服务
3. **更好的模型**: 使用 `gemini-2.5-pro`（更强大的模型）
4. **OpenAI 兼容**: 使用标准的 OpenAI SDK，易于维护

## 🔍 验证

启动应用后，检查日志：

```
============================================================
🔑 AI Builder API Configuration:
   AI_BUILDER_TOKEN: Set (length: 39)
   API Base URL: https://space.ai-builders.com/backend/v1
   Model: gemini-2.5-pro (via AI Builder MCP)
============================================================
```

## 📝 注意事项

1. **本地测试**: 需要在 `.env` 中设置 `AI_BUILDER_TOKEN`
2. **部署**: `AI_BUILDER_TOKEN` 会自动注入，无需配置
3. **模型**: 现在使用 `gemini-2.5-pro`（之前是 `gemini-2.5-flash`）
4. **CORS**: 已添加 `*.ai-builders.space` 到允许的源

## 🐛 故障排查

### 问题: `AI_BUILDER_TOKEN` 未设置

**本地**:
- 检查 `.env` 文件是否存在
- 确认 `AI_BUILDER_TOKEN` 已设置

**部署**:
- `AI_BUILDER_TOKEN` 应该自动注入
- 如果未注入，检查部署配置

### 问题: API 调用失败

1. 检查网络连接
2. 验证 `AI_BUILDER_TOKEN` 是否有效
3. 查看服务器日志中的错误信息

## 📚 相关文档

- [AI Builder API 文档](https://www.ai-builders.com/resources/students-backend/openapi.json)
- [OpenAI SDK 文档](https://github.com/openai/openai-node)

