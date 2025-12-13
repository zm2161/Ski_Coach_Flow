# Flo - 部署说明

## 快速启动（本地 + 公网访问）

### 方法1：使用启动脚本（最简单）

```bash
./start-production.sh
```

脚本会自动：
1. 启动本地服务器（端口3000）
2. 启动ngrok创建公网隧道
3. 显示可以分享给朋友的URL

### 方法2：手动启动

**终端1 - 启动服务器：**
```bash
npm start
```

**终端2 - 启动ngrok：**
```bash
npx ngrok http 3000
```

ngrok会显示公网URL，例如：`https://xxxx-xx-xx-xx.ngrok-free.app`

### 方法3：使用npm脚本

```bash
npm run tunnel
```

## 功能更新

✅ **已实现：**
1. ✅ 移除帧号引用要求 - 指导更自然流畅
2. ✅ 添加地形选择（5种地形：平地/绿道、蓝道、黑道、蘑菇道、自由式）
3. ✅ Gemini提示词根据地形调整分析，评估滑手水平
4. ✅ Landing page改为"单板/双板"选项
5. ✅ Production ready - 可通过ngrok分享

## 访问方式

- **本地访问**: http://localhost:3000
- **公网访问**: 运行ngrok后显示（例如：https://xxxx.ngrok-free.app）

## 使用流程

1. 选择运动项目（单板/双板）
2. 选择地形（5种选项）
3. 上传视频
4. 查看AI分析（根据地形和水平给出针对性建议）
5. 视频结束后查看练习推荐


