# 🔒 安全通知 - API Key 泄露处理

## ⚠️ 重要：API Key 已泄露

您的 Gemini API key 曾经被提交到 GitHub 仓库中。**即使现在已从代码中移除，Git 历史记录中仍然存在**。

## 🚨 立即行动

### 1. 更换 API Key（必须！）

**立即在 Google AI Studio 中撤销并重新生成 API key**：

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 找到旧的 API key
3. 点击 **"Delete"** 删除旧 key
4. 创建新的 API key
5. 更新所有使用该 key 的地方：
   - Railway 环境变量
   - 本地 `.env` 文件
   - 任何其他配置

### 2. 检查 Git 历史

虽然已从当前代码中移除，但 Git 历史中仍然存在：

```bash
# 查看包含 API key 的提交
git log --all --source --full-history -S "AIzaSy" --oneline
```

### 3. 清理 Git 历史（可选但推荐）

如果仓库是私有的，可以考虑：
- 使用 `git filter-branch` 或 `git filter-repo` 从历史中移除
- 或者创建新仓库并重新推送（如果可能）

**注意**：如果仓库是公开的，API key 已经暴露，必须立即更换。

## ✅ 已完成的修复

- ✅ 从所有文档文件中移除了硬编码的 API key
- ✅ 从 `test-gemini-api.js` 中移除了硬编码的 API key
- ✅ 确保 `.env` 在 `.gitignore` 中
- ✅ 所有示例代码现在使用占位符 `YOUR_GEMINI_API_KEY_HERE`

## 📝 最佳实践

### 永远不要：

- ❌ 在代码中硬编码 API key
- ❌ 将 `.env` 文件提交到 Git
- ❌ 在文档中写入真实的 API key
- ❌ 在公开的 GitHub Issues 或 PR 中分享 API key

### 应该这样做：

- ✅ 使用环境变量（`.env` 文件）
- ✅ 确保 `.env` 在 `.gitignore` 中
- ✅ 在文档中使用占位符（如 `YOUR_API_KEY_HERE`）
- ✅ 使用 GitHub Secrets（对于 CI/CD）
- ✅ 定期轮换 API key

## 🔍 检查清单

- [ ] 已在 Google AI Studio 中删除旧 API key
- [ ] 已创建新的 API key
- [ ] 已更新 Railway 环境变量
- [ ] 已更新本地 `.env` 文件
- [ ] 已检查所有部署环境
- [ ] 已测试新 API key 是否工作

## 📚 相关资源

- [Google AI Studio - API Keys](https://makersuite.google.com/app/apikey)
- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

