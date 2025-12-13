#!/bin/bash

# 测试 ngrok 连接的脚本

echo "🔍 测试 ngrok 连接..."
echo ""

# 获取 ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import sys, json; d=json.load(sys.stdin); t=d.get('tunnels',[]); [print(t['public_url']) for t in t if 'https' in t['public_url']]" 2>/dev/null)

if [ -z "$NGROK_URL" ]; then
    echo "❌ 无法获取 ngrok URL"
    echo "请确保 ngrok 正在运行：npx ngrok http 3000"
    exit 1
fi

echo "✅ Ngrok URL: $NGROK_URL"
echo ""

# 测试本地服务器
echo "1. 测试本地服务器 (localhost:3000)..."
LOCAL_RESPONSE=$(curl -s http://localhost:3000/api/video/test 2>&1)
if [[ $? -eq 0 ]]; then
    echo "   ✅ 本地服务器正常"
    echo "   响应: $LOCAL_RESPONSE"
else
    echo "   ❌ 本地服务器无响应"
    echo "   请确保服务器正在运行：node server.js"
    exit 1
fi

echo ""

# 测试 ngrok 连接
echo "2. 测试 ngrok 连接..."
NGROK_RESPONSE=$(curl -s -H "ngrok-skip-browser-warning: true" "$NGROK_URL/api/video/test" 2>&1)

if [[ $? -eq 0 ]] && [[ ! "$NGROK_RESPONSE" =~ "SSL" ]] && [[ ! "$NGROK_RESPONSE" =~ "error" ]]; then
    echo "   ✅ Ngrok 连接正常"
    echo "   响应: $NGROK_RESPONSE"
else
    echo "   ⚠️  Ngrok 连接可能有问题"
    echo "   响应: $NGROK_RESPONSE"
    echo ""
    echo "   💡 解决方案："
    echo "   1. 在浏览器中访问: $NGROK_URL/api/video/test"
    echo "   2. 如果看到警告页面，点击 'Visit Site' 按钮"
    echo "   3. 然后再测试上传功能"
fi

echo ""
echo "3. 使用说明："
echo "   在 Vercel URL 中使用以下 apiBase 参数："
echo "   ?apiBase=$NGROK_URL"
echo ""

