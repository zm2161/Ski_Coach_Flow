#!/bin/bash

# 快速部署脚本到 Vercel（使用 npx，无需全局安装）

echo "🚀 准备部署到 Vercel..."
echo ""

# 进入项目目录
cd "$(dirname "$0")"

echo "📦 当前目录: $(pwd)"
echo ""

# 检查关键文件
if [ ! -f "public/landing.js" ]; then
    echo "❌ 错误: public/landing.js 不存在"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ 错误: vercel.json 不存在"
    exit 1
fi

echo "✅ 文件检查通过"
echo ""

# 使用 npx 部署（不需要全局安装）
echo "开始部署（使用 npx vercel）..."
echo "提示: 如果是第一次使用，会提示登录和配置"
echo ""

npx vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "等待 1-2 分钟后访问你的 Vercel URL，并强制刷新浏览器缓存。"
echo ""
