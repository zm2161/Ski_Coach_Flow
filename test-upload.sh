#!/bin/bash

# 测试上传功能的脚本
# 使用方法: ./test-upload.sh <ngrok_url>

NGROK_URL=${1:-"http://localhost:3000"}

echo "测试后端服务器: $NGROK_URL"
echo ""

# 测试 CORS
echo "1. 测试 CORS 配置..."
curl -s -X OPTIONS "$NGROK_URL/api/upload" \
  -H "Origin: https://traeskiingcoach8oba-b5cvsllax-jennys-projects-d204687a.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "ngrok-skip-browser-warning: true" \
  -v 2>&1 | grep -i "access-control" || echo "CORS headers not found"

echo ""
echo "2. 测试服务器响应..."
curl -s "$NGROK_URL/api/video/test" \
  -H "ngrok-skip-browser-warning: true" \
  | head -3

echo ""
echo "✅ 测试完成"
echo ""
echo "如果看到 CORS headers，说明配置正确"
echo "如果看到 404，说明路由正常（/api/video/test 不存在是正常的）"

