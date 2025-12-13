# 修复 Ngrok SSL 协议错误

## 问题

出现 `ERR_SSL_PROTOCOL_ERROR` 错误，ngrok URL 无法访问。

## 原因

ngrok 免费版在首次访问时会显示浏览器警告页面，需要手动确认才能继续使用。

## 解决方案

### 方法 1: 手动访问 ngrok URL（推荐）

1. **打开浏览器**（Chrome/Safari/Firefox）

2. **访问 ngrok URL**：
   ```
   https://nonauthentical-sherril-unsolubly.ngrok-free.dev/api/video/test
   ```

3. **如果看到 ngrok 警告页面**：
   - 点击 "Visit Site" 或 "Continue" 按钮
   - 这会允许后续请求通过

4. **验证连接**：
   - 应该看到 JSON 响应：`{"error":"未找到视频"}`
   - 这说明连接正常（即使有错误也说明服务器响应了）

5. **然后测试上传**：
   - 访问 Vercel URL（带 apiBase 参数）
   - 强制刷新（Cmd+Shift+R）
   - 尝试上传视频

### 方法 2: 使用 ngrok 付费版

ngrok 付费版可以：
- 跳过浏览器警告页面
- 使用固定域名（URL 不会变化）
- 更好的性能

### 方法 3: 检查 ngrok 状态

```bash
# 检查 ngrok 是否运行
curl -s http://localhost:4040/api/tunnels

# 检查服务器是否运行
curl http://localhost:3000/api/video/test

# 重启 ngrok
pkill -f "ngrok http"
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npx ngrok http 3000
```

### 方法 4: 使用 ngrok 的 authtoken（如果还没设置）

```bash
# 设置 ngrok authtoken（如果有账号）
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## 验证步骤

1. **检查 ngrok 状态**：
   ```bash
   curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(f\"{t['public_url']} -> {t['config']['addr']}\") for t in t]"
   ```
   应该显示：`https://xxx.ngrok-free.dev -> http://localhost:3000`

2. **测试连接**：
   ```bash
   curl -H "ngrok-skip-browser-warning: true" https://nonauthentical-sherril-unsolubly.ngrok-free.dev/api/video/test
   ```

3. **在浏览器中测试**：
   - 直接访问 ngrok URL
   - 如果看到警告页面，点击 "Visit Site"
   - 然后测试上传功能

## 常见问题

### Q: 为什么需要手动访问一次？

A: ngrok 免费版的安全机制，防止滥用。首次访问需要用户确认。

### Q: 每次重启都需要访问吗？

A: 是的，每次重启 ngrok 后，如果 URL 变化，需要重新访问一次。

### Q: 如何避免这个问题？

A: 
- 使用 ngrok 付费版
- 或者保持 ngrok 一直运行（不要重启）
- 或者使用其他内网穿透工具（如 localtunnel）

## 快速测试脚本

```bash
#!/bin/bash
# 测试 ngrok 连接

NGROK_URL="https://nonauthentical-sherril-unsolubly.ngrok-free.dev"

echo "测试 ngrok 连接..."
echo "URL: $NGROK_URL"
echo ""

# 测试连接
response=$(curl -s -H "ngrok-skip-browser-warning: true" "$NGROK_URL/api/video/test" 2>&1)

if [[ $? -eq 0 ]]; then
    echo "✅ 连接成功"
    echo "响应: $response"
else
    echo "❌ 连接失败"
    echo "错误: $response"
    echo ""
    echo "请先在浏览器中访问: $NGROK_URL"
    echo "然后点击 'Visit Site' 按钮"
fi
```

