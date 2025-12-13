# 手动重新部署到 Vercel

## 情况说明
你的项目已经在 Vercel 上，但可能：
1. 没有连接到 Git 仓库（所以 Git push 不会自动部署）
2. 或者连接的是不同的仓库/分支

## 方法 1: 通过 Vercel Dashboard 重新部署（最简单）

### 步骤：

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com
   - 登录你的账号
   - 找到你的项目（应该是 `traeskiingcoach8oba` 或类似名称）

2. **上传新文件**
   - 进入项目设置
   - 找到 "Deployments" 标签
   - 点击 "Redeploy" 或 "Deploy"
   - 或者使用 "Import Project" 重新导入

3. **或者直接拖拽文件**
   - 在 Vercel Dashboard 中，选择 "Deploy" 
   - 选择 "Upload" 选项
   - 拖拽整个项目文件夹（或至少 `public/` 文件夹）

## 方法 2: 使用 Vercel CLI 部署（推荐）

### 安装 Vercel CLI（如果还没安装）

```bash
npm i -g vercel
```

### 部署步骤

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor

# 登录 Vercel（如果还没登录）
vercel login

# 部署到现有项目
vercel --prod
```

如果这是第一次使用 CLI，它会询问：
- 是否链接到现有项目？选择 **Yes**
- 选择你的项目名称
- 确认部署设置

## 方法 3: 连接 Git 仓库（长期方案）

如果你想以后自动部署：

1. **在 Vercel Dashboard 中**：
   - 进入项目设置
   - 找到 "Git" 或 "Settings" > "Git"
   - 点击 "Connect Git Repository"
   - 选择你的 GitHub 仓库（`zm2161/Ski_Coach_Flow`）
   - 选择分支（通常是 `main`）

2. **之后每次 Git push 都会自动部署**

## 方法 4: 直接上传文件到 Vercel

如果以上方法都不行，可以：

1. **压缩项目文件**：
   ```bash
   cd /Users/zhuoranma/Downloads/skiing_coach_cursor
   zip -r deploy.zip public/ vercel.json package.json
   ```

2. **在 Vercel Dashboard 中**：
   - 选择 "Deploy" > "Upload"
   - 上传 `deploy.zip` 文件

## 验证部署

部署完成后（等待 1-2 分钟），访问：

```
https://traeskiingcoach8oba-b5cvsllax-jennys-projects-d204687a.vercel.app/?apiBase=https://nonauthentical-sherril-unsolubly.ngrok-free.dev
```

**强制刷新浏览器**（Cmd+Shift+R 或 Ctrl+Shift+R）

检查：
- ✅ 右上角显示绿色指示器
- ✅ 控制台显示 `[API] ✅ 检测到后端地址`

## 快速检查清单

- [ ] 确认 `public/landing.js` 包含 `isLocal` 检测逻辑
- [ ] 确认 `public/index.html` 中脚本版本是 `v=8`
- [ ] 部署后等待 1-2 分钟
- [ ] 强制刷新浏览器缓存
- [ ] 检查浏览器控制台的 `[API]` 日志

