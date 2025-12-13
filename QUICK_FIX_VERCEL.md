# 快速修复 Vercel 部署

## 问题
本地测试正常（右上角显示绿色指示器），但 Vercel 没有显示。

## 原因
Vercel 缓存了旧版本的代码。

## 解决方案

### 方案 1: 提交并推送代码（如果使用 Git）

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor

# 添加更改的文件
git add public/landing.js public/index.html

# 提交更改
git commit -m "Fix API_BASE detection for Vercel - add localhost auto-detection"

# 推送到远程仓库
git push
```

Vercel 会自动检测到推送并重新部署（通常需要 1-2 分钟）。

### 方案 2: 使用 Vercel CLI 重新部署

```bash
# 如果还没安装 Vercel CLI
npm i -g vercel

# 在项目目录运行
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
vercel --prod
```

### 方案 3: 通过 Vercel Dashboard

1. 访问 https://vercel.com
2. 登录并进入你的项目
3. 点击 "Deployments" 标签
4. 找到最新的部署，点击 "..." 菜单
5. 选择 "Redeploy"

## 验证部署

部署完成后（等待 1-2 分钟），访问：

```
https://traeskiingcoach8oba-b5cvsllax-jennys-projects-d204687a.vercel.app/?apiBase=https://nonauthentical-sherril-unsolubly.ngrok-free.dev
```

**重要**：强制刷新浏览器缓存：
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

然后检查：
1. 右上角应该显示绿色的 ngrok URL 指示器
2. 打开控制台（F12），应该看到 `[API] ✅ 检测到后端地址: ...`

## 如果仍然不显示

1. **检查脚本版本**：
   在浏览器控制台运行：
   ```javascript
   document.querySelector('script[src*="landing.js"]').src
   ```
   应该看到 `landing.js?v=8`

2. **直接访问脚本文件**：
   ```
   https://traeskiingcoach8oba-b5cvsllax-jennys-projects-d204687a.vercel.app/landing.js?v=8
   ```
   检查文件内容，确认包含 `isLocal` 检测逻辑

3. **清除浏览器缓存**：
   - 使用无痕/隐私模式
   - 或清除浏览器缓存后重新访问

