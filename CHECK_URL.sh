#!/bin/bash

echo "🔍 检查ngrok状态..."
echo ""

# 检查ngrok是否运行
if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    tunnels = data.get('tunnels', [])
    if tunnels and len(tunnels) > 0:
        print(tunnels[0].get('public_url', ''))
except:
    pass
" 2>/dev/null)
    
    if [ -n "$URL" ]; then
        echo "✅ ==========================================="
        echo "✅ 公网URL:"
        echo "✅ $URL"
        echo "✅ ==========================================="
        echo ""
        echo "📤 分享给朋友的URL: $URL"
        echo ""
    else
        echo "⚠️  ngrok正在启动中..."
        echo "请访问 http://localhost:4040 查看ngrok Web界面"
    fi
else
    echo "❌ ngrok未运行"
    echo "请先运行: npx ngrok http 3000"
fi

