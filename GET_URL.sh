#!/bin/bash

echo "🌐 正在获取公网URL..."
echo ""

# 检查服务器是否运行
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ 本地服务器未运行"
    echo "请先运行: npm start"
    exit 1
fi

# 检查ngrok是否运行
if ! curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    echo "📡 启动ngrok..."
    npx ngrok http 3000 > /dev/null 2>&1 &
    sleep 5
fi

# 获取URL
URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'] if d.get('tunnels') and len(d['tunnels']) > 0 else '')" 2>/dev/null)

if [ -z "$URL" ]; then
    echo "⚠️  请手动运行以下命令获取URL:"
    echo ""
    echo "npx ngrok http 3000"
    echo ""
    echo "或者访问: http://localhost:4040 查看ngrok Web界面"
else
    echo "✅ ==========================================="
    echo "✅ 公网URL已获取！"
    echo "✅ ==========================================="
    echo ""
    echo "📤 分享给朋友的URL:"
    echo "$URL"
    echo ""
    echo "✅ ==========================================="
fi

