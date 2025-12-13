# 简单部署指南（无需全局安装）

## 方法 1: 使用 npx（推荐，最简单）

不需要全局安装，直接运行：

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
npx vercel --prod
```

如果是第一次使用：
1. 会提示登录 Vercel（在浏览器中打开链接）
2. 选择 "Link to existing project" → 选择你的项目
3. 确认部署设置

## 方法 2: 使用部署脚本

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
./deploy-to-vercel.sh
```

## 方法 3: 通过 Vercel Dashboard（如果 CLI 有问题）

1. 访问 https://vercel.com
2. 登录并进入你的项目
3. 点击 "Deployments" 标签
4. 点击 "..." 菜单 → "Redeploy"
5. 或者点击 "Deploy" → "Upload" → 上传 `public/` 文件夹

## 部署后验证

部署完成后（等待 1-2 分钟），访问：

```
https://traeskiingcoach8oba-b5cvsllax-jennys-projects-d204687a.vercel.app/?apiBase=https://nonauthentical-sherril-unsolubly.ngrok-free.dev
```

**强制刷新浏览器**：
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

检查：
- ✅ 右上角显示绿色指示器
- ✅ 控制台显示 `[API] ✅ 检测到后端地址`

