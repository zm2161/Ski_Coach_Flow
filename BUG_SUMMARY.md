# Bug 总结和修复报告

## 问题描述

前端部署在 Vercel，后端通过 ngrok 暴露，但上传功能失败，显示"获取上传链接失败"。

## Bug 原因分析

### 1. **API_BASE 检测逻辑问题**

**问题**：
- 前端代码在页面加载时没有立即检测 `apiBase` URL 参数
- `getApiBase()` 函数定义在 `DOMContentLoaded` 内部，执行时机太晚
- 本地访问时没有自动识别为本地后端，导致尝试使用 Vercel blob 上传

**表现**：
- 页面右上角没有显示后端地址指示器
- 控制台没有 `[API]` 相关的日志
- 上传时走到 Vercel blob 路径，返回 500 错误

**修复**：
- 将 `getApiBase()` 函数移到全局作用域，在脚本加载时立即执行
- 添加本地访问自动检测：如果 `hostname` 是 `localhost` 或 `127.0.0.1`，自动使用本地后端
- 使用 IIFE（立即执行函数）在页面加载时立即创建指示器
- 添加详细的调试日志和页面指示器

### 2. **Vercel 代码缓存问题**

**问题**：
- Vercel 缓存了旧版本的代码
- Git push 后 Vercel 没有自动重新部署（项目可能没有连接到 Git 仓库）

**表现**：
- 本地测试正常，但 Vercel 上仍然使用旧代码
- 右上角指示器不显示
- 控制台显示旧代码的错误信息

**修复**：
- 使用 `npx vercel --prod` 手动重新部署
- 更新版本号（`landing.js?v=8`）强制浏览器刷新缓存
- 提供强制刷新浏览器的说明

### 3. **vercel.json 配置错误**

**问题**：
- `vercel.json` 中同时使用了 `routes` 和 `headers`
- Vercel 不允许同时使用这两个配置项

**错误信息**：
```
Error: If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present.
```

**修复**：
- 将 `routes` 改为 `rewrites`
- `rewrites` 和 `headers` 可以同时使用

### 4. **前端上传逻辑问题**

**问题**：
- 使用 `fetch` API 上传时，没有正确处理 ngrok 的浏览器警告页面
- 没有上传进度显示
- 错误提示不够详细

**修复**：
- 改用 `XMLHttpRequest` 支持上传进度
- 添加 `ngrok-skip-browser-warning` header
- 改进错误提示，显示具体的错误信息和解决建议

## 修复时间线

1. **第一次修复**：添加 CORS 配置和 ngrok header 支持
2. **第二次修复**：改进 `getApiBase()` 函数，添加 URL 参数解析
3. **第三次修复**：将 API_BASE 检测移到全局作用域，立即执行
4. **第四次修复**：添加本地访问自动检测
5. **第五次修复**：修复 `vercel.json` 配置错误
6. **最终部署**：使用 `npx vercel --prod` 成功部署

## 关键代码改动

### 1. getApiBase() 函数改进

```javascript
function getApiBase() {
    // 本地访问自动检测
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';
    
    if (isLocal) {
        return `http://${window.location.hostname}:${window.location.port || 3000}`;
    }
    
    // Vercel 访问时检查 URL 参数和 localStorage
    // ...
}
```

### 2. 立即执行指示器创建

```javascript
// 在脚本加载时立即执行，不等待 DOM 就绪
(function() {
    const apiBase = getApiBase();
    // 创建指示器...
})();
```

### 3. vercel.json 修复

```json
{
  "rewrites": [  // 从 routes 改为 rewrites
    {
      "source": "/(.*)",
      "destination": "/public/$1"
    }
  ],
  "headers": [...]
}
```

## 经验总结

1. **代码执行时机很重要**：
   - 关键函数应该在脚本加载时立即执行，而不是等待 DOM 就绪
   - 使用 IIFE 可以确保代码立即执行

2. **环境检测**：
   - 应该根据运行环境（本地 vs 生产）自动选择后端
   - 本地开发时不应该依赖 URL 参数

3. **调试工具**：
   - 页面指示器可以快速显示当前状态
   - 详细的控制台日志有助于定位问题

4. **配置检查**：
   - 部署前应该检查配置文件的有效性
   - Vercel 的配置规则需要仔细阅读文档

5. **缓存问题**：
   - 浏览器和 CDN 都会缓存静态资源
   - 使用版本号或时间戳可以强制刷新
   - 部署后需要强制刷新浏览器

## 预防措施

1. **代码检查清单**：
   - [ ] API_BASE 检测逻辑是否正确
   - [ ] 本地访问是否自动识别
   - [ ] 页面指示器是否正确显示
   - [ ] 控制台日志是否完整

2. **部署检查清单**：
   - [ ] `vercel.json` 配置是否正确
   - [ ] 文件版本号是否更新
   - [ ] 是否强制刷新浏览器缓存
   - [ ] 控制台是否有错误信息

3. **测试检查清单**：
   - [ ] 本地测试是否正常
   - [ ] Vercel 部署是否成功
   - [ ] 右上角指示器是否显示
   - [ ] 上传功能是否正常

## 最终状态

✅ 本地访问：自动使用本地后端，右上角显示绿色指示器  
✅ Vercel 访问：通过 `apiBase` 参数使用 ngrok 后端，右上角显示绿色指示器  
✅ 上传功能：正常工作，使用正确的后端  
✅ 错误提示：清晰明确，包含解决建议

