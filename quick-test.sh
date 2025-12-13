#!/bin/bash

# 快速测试脚本（支持 localtunnel）

echo "🧪 Flo 项目测试"
echo "=================="
echo ""

cd "$(dirname "$0")"

# 1. 检查服务器
echo "1️⃣  检查本地服务器..."
if curl -s http://localhost:3000/api/video/test > /dev/null 2>&1; then
    echo "   ✅ 服务器运行正常"
else
    echo "   ❌ 服务器未运行"
    echo "   请运行: node server.js"
    exit 1
fi

# 2. 检查 localtunnel
echo ""
echo "2️⃣  检查 localtunnel..."
if ps aux | grep -E "localtunnel|lt" | grep -v grep > /dev/null; then
    echo "   ✅ localtunnel 正在运行"
    echo "   💡 请查看 localtunnel 终端窗口获取 URL (格式: https://xxx.loca.lt)"
else
    echo "   ❌ localtunnel 未运行"
    echo "   请运行: npx localtunnel --port 3000"
    echo "   或运行: ./start-localtunnel.sh"
    exit 1
fi

# 3. 检查环境变量
echo ""
echo "3️⃣  检查环境变量..."
GEMINI_LENGTH=$(node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY?.length || 0);" 2>/dev/null)
if [ "$GEMINI_LENGTH" -gt 0 ]; then
    echo "   ✅ GEMINI_API_KEY 已加载 (长度: $GEMINI_LENGTH)"
else
    echo "   ❌ GEMINI_API_KEY 未加载"
    echo "   请检查 .env 文件"
    exit 1
fi

# 4. 显示测试步骤
echo ""
echo "4️⃣  下一步："
echo "   1. 查看 localtunnel 终端窗口，复制显示的 URL（例如: https://xxx.loca.lt）"
echo "   2. 在浏览器中测试 localtunnel URL:"
echo "      https://your-url.loca.lt/api/video/test"
echo "   3. 访问 Vercel URL（带 apiBase 参数）:"
echo "      https://traeskiingcoach8oba-naif6t401-jennys-projects-d204687a.vercel.app/?apiBase=https://your-url.loca.lt"
echo "   4. 测试上传功能"
echo ""
echo "✅ 所有检查通过！可以开始测试了"
