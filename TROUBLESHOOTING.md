# 故障排查指南

## 问题：上传失败，显示"获取上传链接失败"

### 可能原因和解决方案

#### 1. API_BASE 未被正确识别

**症状**: 页面右上角没有显示绿色的"后端: xxx"指示器

**检查步骤**:
1. 打开浏览器控制台（F12）
2. 查看是否有 `[API]` 开头的日志
3. 检查 URL 参数格式是否正确

**解决方案**:
- 确保 URL 格式正确：`?apiBase=https://xxxxx.ngrok-free.dev`
- 如果 URL 中没有 `https://`，代码会自动添加
- 清除 localStorage 后重试：访问 `?clearApiBase=1&apiBase=https://xxxxx.ngrok-free.dev`

#### 2. URL 参数被编码

**症状**: URL 中的 `apiBase` 参数包含 `%3A` 或 `%2F` 等编码字符

**解决方案**:
- 确保 URL 参数没有被双重编码
- 尝试手动输入 URL：`?apiBase=https://your-ngrok-url.ngrok-free.dev`

#### 3. localStorage 被清除

**症状**: 刷新页面后 API_BASE 丢失

**解决方案**:
- 重新访问带 `apiBase` 参数的 URL
- 检查浏览器是否禁用了 localStorage
- 尝试使用隐私模式/无痕模式

#### 4. ngrok 连接问题

**症状**: 控制台显示网络错误

**检查步骤**:
1. 确认本地服务器正在运行：`curl http://localhost:3000/api/video/test`
2. 确认 ngrok 正在运行：访问 `http://localhost:4040` 查看 ngrok 状态
3. 测试 ngrok URL：`curl -H "ngrok-skip-browser-warning: true" https://your-ngrok-url.ngrok-free.dev/api/video/test`

**解决方案**:
- 重启 ngrok：`npx ngrok http 3000`
- 检查防火墙设置
- 确认 ngrok URL 没有过期

#### 5. CORS 错误

**症状**: 控制台显示 CORS 相关错误

**检查步骤**:
1. 查看浏览器控制台的错误信息
2. 检查 `server.js` 中的 CORS 配置

**解决方案**:
- 确认后端服务器正在运行
- 检查 `server.js` 中的 CORS origin 配置是否包含你的 Vercel 域名
- 确认请求头包含 `ngrok-skip-browser-warning: true`

### 调试步骤

1. **打开浏览器控制台（F12）**
   - 查看所有 `[API]` 和 `[Upload]` 开头的日志
   - 检查是否有红色错误信息

2. **检查页面指示器**
   - 页面右上角应该显示绿色的"后端: xxx"指示器
   - 如果没有显示，说明 API_BASE 未被识别

3. **检查网络请求**
   - 在 Network 标签页查看上传请求
   - 确认请求 URL 是否正确
   - 检查请求头是否包含 `ngrok-skip-browser-warning`

4. **测试后端连接**
   ```bash
   # 测试本地服务器
   curl http://localhost:3000/api/video/test
   
   # 测试 ngrok
   curl -H "ngrok-skip-browser-warning: true" https://your-ngrok-url.ngrok-free.dev/api/video/test
   ```

### 常见错误信息

#### "获取上传链接失败（状态码 404）"
- **原因**: 走到了 Vercel blob 上传路径，但 Vercel 没有配置 `BLOB_READ_WRITE_TOKEN`
- **解决**: 确保 URL 中包含 `apiBase` 参数

#### "网络错误，请检查ngrok连接"
- **原因**: 无法连接到 ngrok URL
- **解决**: 检查 ngrok 是否运行，URL 是否正确

#### "上传失败（状态码 500）"
- **原因**: 后端服务器错误
- **解决**: 查看后端服务器日志，检查是否有错误信息

#### "响应解析失败"
- **原因**: 后端返回的不是有效的 JSON
- **解决**: 查看后端服务器日志，检查响应内容

### 快速测试

访问以下 URL 测试 API_BASE 识别：

```
https://your-vercel-app.vercel.app/?apiBase=https://your-ngrok-url.ngrok-free.dev
```

打开控制台，应该看到：
```
[API] URL参数中的apiBase: https://your-ngrok-url.ngrok-free.dev
[API] 从URL参数设置API_BASE: https://your-ngrok-url.ngrok-free.dev
[API] 当前使用的后端地址: https://your-ngrok-url.ngrok-free.dev
```

页面右上角应该显示绿色的指示器。

