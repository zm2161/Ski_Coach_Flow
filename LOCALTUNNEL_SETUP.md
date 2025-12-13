# LocalTunnel 设置指南

## 什么是 LocalTunnel？

LocalTunnel 是一个免费的内网穿透工具，可以替代 ngrok。它的优点是：
- ✅ 完全免费
- ✅ 不需要账号
- ✅ 不需要浏览器警告页面
- ✅ 使用简单

## 安装和使用

### 方法 1: 使用 npx（推荐，无需安装）

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npx localtunnel --port 3000
```

### 方法 2: 使用启动脚本

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
./start-localtunnel.sh
```

## 获取 URL

启动后，localtunnel 会在终端显示一个 URL，例如：
```
your url is: https://random-words-1234.loca.lt
```

**重要**：复制这个 URL，稍后需要在 Vercel URL 中使用。

## 使用步骤

### 1. 启动本地服务器

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
node server.js
```

### 2. 启动 localtunnel

```bash
npx localtunnel --port 3000
```

### 3. 复制显示的 URL

例如：`https://random-words-1234.loca.lt`

### 4. 访问 Vercel URL（带 apiBase 参数）

```
https://traeskiingcoach8oba-naif6t401-jennys-projects-d204687a.vercel.app/?apiBase=https://random-words-1234.loca.lt
```

### 5. 测试上传功能

- 选择运动项目和地形
- 上传视频
- 应该可以正常工作

## 与 ngrok 的区别

| 特性 | ngrok | localtunnel |
|------|-------|-------------|
| 免费版 | ✅ | ✅ |
| 需要账号 | ✅ | ❌ |
| 浏览器警告 | ✅ | ❌ |
| 固定域名 | 付费版 | ❌ |
| URL 格式 | `xxx.ngrok-free.dev` | `xxx.loca.lt` |

## 注意事项

1. **URL 会变化**：每次重启 localtunnel，URL 都会变化
2. **需要更新 Vercel URL**：URL 变化后，需要更新 Vercel URL 中的 `apiBase` 参数
3. **保持运行**：localtunnel 需要保持运行，关闭终端会断开连接

## 保持运行（后台运行）

### 使用 screen（推荐）

```bash
# 安装 screen（如果还没安装）
# macOS: brew install screen

# 创建新的 screen 会话
screen -S localtunnel

# 在 screen 中启动 localtunnel
npx localtunnel --port 3000

# 按 Ctrl+A 然后 D 退出 screen（localtunnel 继续运行）

# 重新连接
screen -r localtunnel
```

### 使用 nohup

```bash
nohup npx localtunnel --port 3000 > localtunnel.log 2>&1 &
```

## 测试连接

```bash
# 测试 localtunnel URL（替换为你的 URL）
curl https://your-url.loca.lt/api/video/test

# 应该返回 JSON 响应
```

## 故障排查

### 问题：URL 无法访问

**解决**：
1. 检查 localtunnel 是否还在运行
2. 检查本地服务器是否在运行（端口 3000）
3. 重新启动 localtunnel

### 问题：连接超时

**解决**：
1. 检查防火墙设置
2. 确保本地服务器正在运行
3. 尝试重新启动 localtunnel

### 问题：URL 变化

**解决**：
- 这是正常的，每次重启都会变化
- 更新 Vercel URL 中的 `apiBase` 参数

## 快速测试脚本

```bash
# 测试 localtunnel 连接
./test-localtunnel.sh
```

（需要创建测试脚本）

