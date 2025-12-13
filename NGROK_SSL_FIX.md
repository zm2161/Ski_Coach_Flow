# 修复 Ngrok SSL 协议错误

## 问题

访问 ngrok URL 时出现 SSL 协议版本错误，无法连接。

## 可能的原因

1. **ngrok 版本过旧**：旧版本的 ngrok 可能不支持最新的 TLS 协议
2. **ngrok 免费版限制**：免费版可能有连接限制
3. **网络问题**：防火墙或代理可能阻止连接

## 解决方案

### 方案 1: 更新 ngrok（推荐）

```bash
# 停止旧的 ngrok
pkill -f "ngrok http"

# 使用最新版本的 ngrok
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npx --yes ngrok@latest http 3000
```

### 方案 2: 在浏览器中测试

有时候 curl 会有 SSL 问题，但浏览器可以正常访问：

1. 打开浏览器（Chrome/Safari）
2. 访问 ngrok URL
3. 如果看到警告页面，点击 "Visit Site"
4. 然后测试上传功能

### 方案 3: 使用 ngrok 的 HTTP 端点（如果可用）

某些 ngrok 配置可能提供 HTTP 端点，但免费版通常只有 HTTPS。

### 方案 4: 检查防火墙设置

确保防火墙没有阻止 ngrok 连接。

## 验证步骤

1. **检查 ngrok 状态**：
   ```bash
   curl -s http://localhost:4040/api/tunnels
   ```

2. **测试本地服务器**：
   ```bash
   curl http://localhost:3000/api/video/test
   ```

3. **在浏览器中测试**：
   - 打开浏览器
   - 访问 ngrok URL
   - 检查是否能正常访问

## 如果仍然无法访问

1. **重启 ngrok**：
   ```bash
   pkill -f "ngrok http"
   sleep 2
   npx ngrok http 3000
   ```

2. **获取新的 URL**：
   ```bash
   sleep 5
   curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(t['public_url']) for t in t if 'https' in t['public_url']]"
   ```

3. **更新 Vercel URL**：
   使用新的 ngrok URL 更新 `apiBase` 参数

## 临时解决方案

如果 ngrok 一直有问题，可以考虑：

1. **使用其他内网穿透工具**：
   - localtunnel: `npx localtunnel --port 3000`
   - serveo: `ssh -R 80:localhost:3000 serveo.net`

2. **使用 ngrok 付费版**：
   - 更好的稳定性
   - 固定域名
   - 跳过浏览器警告

