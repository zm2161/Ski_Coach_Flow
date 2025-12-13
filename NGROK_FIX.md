# Ngrok 端口不匹配问题修复

## 问题

出现 `ERR_SSL_PROTOCOL_ERROR` 错误，原因是：
- ngrok 指向 `localhost:3011`
- 但服务器运行在 `localhost:3000`
- 端口不匹配导致连接失败

## 解决方案

### 1. 确保服务器运行在正确的端口

```bash
# 检查服务器是否在 3000 端口运行
curl http://localhost:3000/api/video/test
```

### 2. 重启 ngrok 指向正确的端口

```bash
# 停止旧的 ngrok 进程
pkill -f "ngrok http"

# 启动新的 ngrok，指向端口 3000
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npx ngrok http 3000
```

### 3. 获取新的 ngrok URL

```bash
# 等待几秒后获取 URL
sleep 5
curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(t['public_url']) for t in t if 'https' in t['public_url']]"
```

### 4. 更新 Vercel URL 中的 apiBase 参数

如果 ngrok URL 改变了，需要更新 Vercel URL：

```
https://your-vercel-app.vercel.app/?apiBase=https://新的-ngrok-url.ngrok-free.dev
```

## 验证

1. **测试 ngrok 连接**：
   ```bash
   curl -H "ngrok-skip-browser-warning: true" https://your-ngrok-url.ngrok-free.dev/api/video/test
   ```
   应该返回 JSON 响应（即使返回错误，也说明连接正常）

2. **检查端口映射**：
   ```bash
   curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(f\"{t['public_url']} -> {t['config']['addr']}\") for t in t]"
   ```
   应该显示：`https://xxx.ngrok-free.dev -> http://localhost:3000`

3. **在浏览器中测试**：
   - 访问 Vercel URL（带正确的 apiBase 参数）
   - 强制刷新（Cmd+Shift+R）
   - 尝试上传视频
   - 检查控制台是否有错误

## 常见问题

### Q: ngrok URL 每次重启都变化？

A: ngrok 免费版每次重启 URL 都会变化。解决方案：
- 使用 ngrok 付费版获得固定域名
- 或者每次重启后更新 Vercel URL 中的 apiBase 参数

### Q: 如何保持 ngrok 一直运行？

A: 使用 `screen` 或 `tmux`：
```bash
# 使用 screen
screen -S ngrok
npx ngrok http 3000
# 按 Ctrl+A 然后 D 退出 screen（ngrok 继续运行）

# 重新连接
screen -r ngrok
```

### Q: 如何检查 ngrok 是否正常运行？

A: 
```bash
# 检查进程
ps aux | grep ngrok

# 检查 ngrok web 界面
open http://localhost:4040

# 检查 API
curl http://localhost:4040/api/tunnels
```

