# 测试指南

## 快速测试清单

### 1. 检查服务器状态

```bash
# 检查本地服务器是否运行
curl http://localhost:3000/api/video/test

# 应该返回: {"error":"未找到视频"} (说明服务器正常)
```

### 2. 检查 ngrok 状态

```bash
# 检查 ngrok 是否运行
curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(f\"{t['public_url']} -> {t['config']['addr']}\") for t in t]"

# 应该显示: https://xxx.ngrok-free.dev -> http://localhost:3000
```

### 3. 检查环境变量

```bash
# 检查 GEMINI_API_KEY 是否正确加载
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
node -e "require('dotenv').config(); console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);"

# 应该显示: GEMINI_API_KEY length: 39
```

### 4. 测试 ngrok 连接（在浏览器中）

1. **打开浏览器**（Chrome/Safari）
2. **访问 ngrok URL**：
   ```
   https://你的-ngrok-url.ngrok-free.dev/api/video/test
   ```
3. **如果看到警告页面**：
   - 点击 "Visit Site" 或 "Continue"
4. **如果看到 JSON 响应**：
   - 说明连接正常，可以继续

### 5. 测试 Vercel 前端

1. **访问 Vercel URL**（带 apiBase 参数）：
   ```
   https://traeskiingcoach8oba-naif6t401-jennys-projects-d204687a.vercel.app/?apiBase=https://你的-ngrok-url.ngrok-free.dev
   ```

2. **检查页面右上角**：
   - 应该显示绿色的 ngrok URL 指示器
   - 例如：`🔗 nonauthentical-sherril-unsolubly...`

3. **打开浏览器控制台**（F12）：
   - 应该看到：
     ```
     [API] URL参数中的apiBase: https://...
     [API] 从URL参数设置API_BASE: https://...
     [API] ✅ 检测到后端地址: https://...
     ```

### 6. 测试完整上传流程

1. **选择运动项目**：
   - 点击 "双板" 或 "单板"

2. **选择地形**：
   - 选择任意地形（如 "蓝道"）

3. **选择视频文件**：
   - 点击上传区域或拖拽视频文件
   - 支持格式：MP4、MOV、AVI、WEBM（最大 100MB）

4. **点击"上传视频"按钮**

5. **观察上传进度**：
   - 应该看到进度条更新
   - 控制台应该显示：
     ```
     [Upload] ✅ 使用本地后端: https://...
     [Upload] 开始上传...
     [Upload] 进度: X%
     ```

6. **等待处理完成**：
   - 视频上传后会自动分析
   - 完成后会跳转到分析页面

## 一键测试脚本

运行以下脚本进行完整测试：

```bash
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
./test-ngrok-connection.sh
```

## 常见问题排查

### 问题 1: 服务器无响应

**检查**：
```bash
# 检查服务器进程
ps aux | grep "node server.js" | grep -v grep

# 检查端口占用
lsof -ti:3000
```

**解决**：
```bash
# 重启服务器
cd /Users/zhuoranma/Downloads/skiing_coach_cursor
lsof -ti:3000 | xargs kill -9
node server.js
```

### 问题 2: ngrok 连接失败

**检查**：
```bash
# 检查 ngrok 进程
ps aux | grep ngrok | grep -v grep

# 检查 ngrok 状态
curl -s http://localhost:4040/api/tunnels
```

**解决**：
```bash
# 重启 ngrok
pkill -f "ngrok http"
npx ngrok http 3000
```

### 问题 3: GEMINI_API_KEY 未加载

**检查**：
```bash
# 检查 .env 文件
cat .env | grep GEMINI_API_KEY

# 测试加载
node -e "require('dotenv').config(); console.log('Length:', process.env.GEMINI_API_KEY?.length);"
```

**解决**：
- 确保 `.env` 文件在项目根目录
- 确保变量名是 `GEMINI_API_KEY`（不是 `VITE_GEMINI_API_KEY`）
- 重启服务器

### 问题 4: 上传一直显示 0%

**可能原因**：
- ngrok 需要先在浏览器中访问一次
- 网络连接问题

**解决**：
1. 在浏览器中访问一次 ngrok URL
2. 点击 "Visit Site"（如果看到警告页面）
3. 然后再测试上传

### 问题 5: Vercel 右上角没有指示器

**可能原因**：
- 浏览器缓存了旧代码
- URL 参数格式错误

**解决**：
1. 强制刷新浏览器（Cmd+Shift+R）
2. 检查 URL 参数格式：`?apiBase=https://xxx.ngrok-free.dev`
3. 检查控制台是否有错误

## 测试视频文件

如果没有测试视频，可以使用项目中的示例：

```bash
# 检查是否有示例视频
ls -lh /Users/zhuoranma/Downloads/skiing_coach_cursor/example.MOV

# 或者使用 uploads 目录中的视频
ls -lh /Users/zhuoranma/Downloads/skiing_coach_cursor/uploads/*.MOV | head -1
```

## 完整测试流程

1. ✅ **启动服务器**：
   ```bash
   cd /Users/zhuoranma/Downloads/skiing_coach_cursor
   node server.js
   ```

2. ✅ **启动 ngrok**：
   ```bash
   npx ngrok http 3000
   ```

3. ✅ **获取 ngrok URL**：
   ```bash
   curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(t['public_url']) for t in t if 'https' in t['public_url']]"
   ```

4. ✅ **在浏览器中访问 ngrok URL**（绕过警告页面）

5. ✅ **访问 Vercel URL**（带 apiBase 参数）

6. ✅ **测试上传功能**

## 预期结果

### 成功上传后应该：

1. ✅ 看到上传进度更新（0% → 100%）
2. ✅ 控制台显示处理进度
3. ✅ 自动跳转到分析页面
4. ✅ 看到视频播放和教练反馈窗口

### 如果失败：

- 检查浏览器控制台的错误信息
- 检查服务器日志
- 检查 ngrok 状态
- 参考上面的"常见问题排查"

