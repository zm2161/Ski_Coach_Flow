# Vercel 部署指南

## 问题：Vercel 右上角没有显示指示器

这通常是因为 Vercel 缓存了旧版本的代码。以下是解决方案：

## 方法 1: 通过 Vercel CLI 重新部署（推荐）

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 在项目根目录运行
cd /Users/zhuoranma/Downloads/skiing_coach_cursor

# 部署到生产环境
vercel --prod
```

## 方法 2: 通过 Vercel Dashboard 重新部署

1. 访问 [vercel.com](https://vercel.com)
2. 登录并进入你的项目
3. 点击 "Deployments" 标签
4. 找到最新的部署，点击右侧的 "..." 菜单
5. 选择 "Redeploy"
6. 确认重新部署

## 方法 3: 推送代码到 Git（如果使用 Git 部署）

如果你使用 Git 仓库部署：

```bash
# 检查 Git 状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "Update landing.js to v8 - fix API_BASE detection"

# 推送到远程仓库
git push
```

Vercel 会自动检测到推送并重新部署。

## 方法 4: 强制浏览器刷新（临时方案）

如果代码已经更新但浏览器还在使用缓存：

1. **清除浏览器缓存**：
   - Chrome: 设置 > 隐私和安全 > 清除浏览数据 > 选择"缓存的图片和文件"
   - Firefox: 设置 > 隐私与安全 > Cookie 和网站数据 > 清除数据
   - Safari: 偏好设置 > 隐私 > 管理网站数据 > 移除所有

2. **使用无痕/隐私模式**：
   - 打开新的无痕窗口
   - 访问你的 Vercel URL

3. **在 URL 后添加随机参数**：
   ```
   https://your-app.vercel.app/?apiBase=https://your-ngrok-url.ngrok-free.dev&_t=1234567890
   ```

## 验证新代码已部署

打开浏览器控制台（F12），应该看到：

```
[API] URL参数中的apiBase: https://...
[API] 从URL参数设置API_BASE: https://...
[API] ✅ 检测到后端地址: https://...
```

如果看到这些日志，说明新代码已加载。

## 检查部署版本

在浏览器控制台运行：

```javascript
// 检查脚本版本
Array.from(document.querySelectorAll('script')).forEach(s => {
    if (s.src.includes('landing.js')) {
        console.log('landing.js URL:', s.src);
    }
});
```

应该看到 `landing.js?v=8`。

## 如果仍然不工作

1. **检查 Vercel 部署日志**：
   - 在 Vercel Dashboard 中查看最新的部署
   - 检查是否有构建错误

2. **检查文件是否正确上传**：
   - 在 Vercel Dashboard 中查看项目文件
   - 确认 `public/landing.js` 文件存在且是最新版本

3. **手动验证代码**：
   - 访问 `https://your-app.vercel.app/landing.js?v=8`
   - 检查文件内容，确认包含 `getApiBase()` 函数和本地检测逻辑

## 快速测试脚本

在浏览器控制台运行以下代码来测试 API_BASE 检测：

```javascript
// 测试 getApiBase 函数
function testGetApiBase() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('apiBase');
    console.log('URL参数:', fromQuery);
    
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
    console.log('是否本地:', isLocal);
    
    const stored = localStorage.getItem('apiBase');
    console.log('localStorage:', stored);
    
    return { fromQuery, isLocal, stored };
}

testGetApiBase();
```

