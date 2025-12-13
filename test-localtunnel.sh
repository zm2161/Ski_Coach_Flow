#!/bin/bash

# 测试 localtunnel 连接

echo "🧪 测试 LocalTunnel 连接"
echo "========================"
echo ""

# 检查本地服务器
echo "1️⃣  检查本地服务器..."
if curl -s http://localhost:3000/api/video/test > /dev/null 2>&1; then
    echo "   ✅ 服务器运行正常"
else
    echo "   ❌ 服务器未运行"
    echo "   请运行: node server.js"
    exit 1
fi

# 检查 localtunnel
echo ""
echo "2️⃣  检查 localtunnel..."
if ps aux | grep -E "localtunnel|lt" | grep -v grep > /dev/null; then
    echo "   ✅ localtunnel 正在运行"
    echo ""
    echo "   💡 提示："
    echo "   - 查看 localtunnel 终端窗口获取 URL"
    echo "   - URL 格式通常是: https://xxx.loca.lt"
    echo "   - 如果没有看到 URL，请重新启动 localtunnel"
else
    echo "   ❌ localtunnel 未运行"
    echo "   请运行: npx localtunnel --port 3000"
    exit 1
fi

# 检查环境变量
echo ""
echo "3️⃣  检查环境变量..."
GEMINI_LENGTH=$(node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY?.length || 0);" 2>/dev/null)
if [ "$GEMINI_LENGTH" -gt 0 ]; then
    echo "   ✅ GEMINI_API_KEY 已加载 (长度: $GEMINI_LENGTH)"
else
    echo "   ❌ GEMINI_API_KEY 未加载"
    exit 1
fi

echo ""
echo "4️⃣  下一步："
echo "   1. 查看 localtunnel 终端窗口，复制显示的 URL"
echo "   2. 在浏览器中访问: https://your-url.loca.lt/api/video/test"
echo "   3. 然后访问 Vercel URL（带 apiBase 参数）"
echo ""
echo "✅ 所有检查通过！"

