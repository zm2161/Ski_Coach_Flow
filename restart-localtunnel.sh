#!/bin/bash

# 重启 localtunnel 脚本

echo "🔄 重启 localtunnel..."
echo ""

cd "$(dirname "$0")"

# 停止旧的 localtunnel
pkill -f "localtunnel" 2>/dev/null
sleep 2

# 检查服务器是否运行
if ! curl -s http://localhost:3000/api/video/test > /dev/null 2>&1; then
    echo "❌ 本地服务器未运行"
    echo "请先启动服务器: node server.js"
    exit 1
fi

echo "✅ 本地服务器运行正常"
echo ""
echo "正在启动 localtunnel..."
echo "提示: localtunnel 会显示一个 URL，例如: https://xxx.loca.lt"
echo ""

npx localtunnel --port 3000

