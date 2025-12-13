#!/bin/bash

# 启动 localtunnel 脚本

echo "🚇 启动 localtunnel..."
echo ""

cd "$(dirname "$0")"

# 停止旧的 localtunnel
pkill -f "localtunnel" 2>/dev/null
sleep 1

# 启动 localtunnel
echo "正在启动 localtunnel (端口 3000)..."
echo "提示: localtunnel 会显示一个 URL，例如: https://xxx.loca.lt"
echo ""

npx localtunnel --port 3000

