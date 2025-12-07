# Flo - Production 部署指南

## 🚀 快速启动（获取可分享的URL）

### 步骤1：启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 运行

### 步骤2：在新终端启动ngrok（创建公网URL）

```bash
npx ngrok http 3000
```

ngrok会显示类似这样的输出：
```
Forwarding   https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3000
```

**这个 `https://xxxx-xxxx-xxxx.ngrok-free.app` 就是您可以分享给朋友的URL！**

### 步骤3：分享URL

将ngrok显示的HTTPS URL复制并分享给朋友即可。

---

## 📋 已实现的功能

✅ **1. 指导不引用帧号** - 自然流畅的分析
✅ **2. 地形选择功能** - 5种地形选项
✅ **3. 根据地形调整分析** - 评估水平，给出针对性建议
✅ **4. 单板/双板选项** - Landing page已更新
✅ **5. Production部署** - 可通过ngrok分享

---

## 🎯 使用流程

1. **选择运动项目**: 单板 或 双板
2. **选择地形**: 
   - 平地 / 绿道（初级）
   - 蓝道（中级）
   - 黑道（高级陡坡）
   - 蘑菇道（雪包地形）
   - 自由式（公园、跳台、道具）
3. **上传视频**: 拖拽或点击上传
4. **查看分析**: AI根据地形和水平给出针对性教练反馈
5. **练习推荐**: 视频结束后自动显示专项练习

---

## 🔧 故障排除

### 如果ngrok无法启动：
```bash
# 手动安装ngrok
npm install -g ngrok

# 然后运行
ngrok http 3000
```

### 如果端口被占用：
```bash
# 杀死占用端口的进程
lsof -ti:3000 | xargs kill -9
```

### 如果服务器启动失败：
```bash
# 检查Node.js版本（需要v14+）
node --version

# 重新安装依赖
npm install
```

---

## 📱 测试URL

当ngrok运行后，您会看到类似这样的URL：
- `https://abc123def456.ngrok-free.app`

将这个URL分享给任何人，他们都可以访问您的Flo应用！

