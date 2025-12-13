# 清除 Vercel 缓存

如果页面右上角没有显示指示器，或者控制台显示旧代码的错误，说明 Vercel 可能缓存了旧版本的代码。

## 方法 1: 强制刷新浏览器缓存

1. **Chrome/Edge**: 按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)
2. **Firefox**: 按 `Ctrl+F5` (Windows) 或 `Cmd+Shift+R` (Mac)
3. **Safari**: 按 `Cmd+Option+R`

## 方法 2: 清除浏览器缓存

1. 打开浏览器设置
2. 清除浏览数据/缓存
3. 选择"缓存的图片和文件"
4. 清除后重新访问页面

## 方法 3: 使用无痕/隐私模式

1. 打开无痕/隐私窗口
2. 访问你的 Vercel URL（带 apiBase 参数）

## 方法 4: 在 URL 中添加版本参数

访问时在 URL 后添加随机参数强制刷新：
```
https://your-vercel-app.vercel.app/?apiBase=https://your-ngrok-url.ngrok-free.dev&v=7
```

## 方法 5: 重新部署到 Vercel

如果以上方法都不行，可能需要重新部署：

```bash
# 在项目根目录
vercel --prod
```

或者通过 Vercel Dashboard：
1. 进入项目设置
2. 点击 "Redeploy"
3. 选择最新的部署

## 验证新代码已加载

打开浏览器控制台（F12），应该看到：
```
[API] URL参数中的apiBase: https://...
[API] 从URL参数设置API_BASE: https://...
[API] ✅ 检测到后端地址: https://...
```

如果看到这些日志，说明新代码已加载。

