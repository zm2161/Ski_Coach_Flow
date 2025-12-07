#!/bin/bash

# Flo - Production启动脚本
# 启动服务器并创建公网URL

echo "🚀 启动 Flo 应用..."
echo ""

# 杀死可能存在的进程
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:4040 | xargs kill -9 2>/dev/null

# 启动服务器
echo "📡 启动本地服务器..."
node server.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 检查服务器是否启动
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ 服务器启动失败"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ 本地服务器已启动: http://localhost:3000"
echo ""

# 启动ngrok
echo "🌐 启动 ngrok 隧道..."
npx --yes ngrok http 3000 > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

sleep 5

# 获取ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | head -1 | sed 's/"public_url":"//;s/"$//')

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  无法自动获取ngrok URL"
    echo "请手动访问: http://localhost:4040 查看ngrok Web界面"
    echo ""
    echo "或者在新终端运行:"
    echo "npx ngrok http 3000"
else
    echo "✅ ==========================================="
    echo "✅ Flo 应用已启动！"
    echo "✅ ==========================================="
    echo "✅ 本地地址: http://localhost:3000"
    echo "✅ 公网地址: $NGROK_URL"
    echo "✅ ==========================================="
    echo ""
    echo "📤 分享给朋友的URL: $NGROK_URL"
    echo ""
fi

echo "按 Ctrl+C 停止服务器"
echo ""

# 等待中断信号
trap "kill $SERVER_PID $NGROK_PID 2>/dev/null; exit" INT
wait

