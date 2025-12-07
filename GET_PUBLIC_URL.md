# 获取公网访问URL

## 方法1：使用 ngrok（推荐）

### 启动服务器和ngrok：

```bash
# 在终端1：启动服务器
npm start

# 在终端2：启动ngrok（会自动生成公网URL）
npx ngrok http 3000
```

ngrok会显示一个公网URL，例如：`https://xxxx-xx-xx-xx-xx.ngrok-free.app`

将这个URL分享给朋友即可访问。

## 方法2：使用本地IP（同一网络）

如果朋友在同一个WiFi网络下：

```bash
# 查找您的本地IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# 或
ipconfig getifaddr en0
```

然后访问：`http://您的IP:3000`

## 方法3：使用start-with-ngrok.js脚本

```bash
npm run tunnel
```

脚本会自动启动服务器和ngrok，并显示公网URL。

