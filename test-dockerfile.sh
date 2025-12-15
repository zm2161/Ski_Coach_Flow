#!/bin/bash
# Test Dockerfile validation script

echo "🔍 验证 Dockerfile..."

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile 不存在"
    exit 1
fi

echo "✅ Dockerfile 存在"

# Check Dockerfile syntax
echo ""
echo "📋 检查 Dockerfile 内容..."

# Check for required components
REQUIRED_ITEMS=(
    "FROM node"
    "WORKDIR"
    "COPY package"
    "RUN npm"
    "EXPOSE"
    "CMD"
)

MISSING_ITEMS=()

for item in "${REQUIRED_ITEMS[@]}"; do
    if ! grep -q "$item" Dockerfile; then
        MISSING_ITEMS+=("$item")
    fi
done

if [ ${#MISSING_ITEMS[@]} -gt 0 ]; then
    echo "❌ Dockerfile 缺少以下必需项:"
    for item in "${MISSING_ITEMS[@]}"; do
        echo "   - $item"
    done
    exit 1
fi

echo "✅ Dockerfile 包含所有必需项"

# Check for PORT environment variable usage
echo ""
echo "🔍 检查 PORT 环境变量使用..."

if grep -q "PORT" Dockerfile; then
    echo "✅ Dockerfile 包含 PORT 相关配置"
else
    echo "⚠️  Dockerfile 未明确提及 PORT（但 CMD 使用 shell form，应该可以工作）"
fi

# Check CMD format (should use shell form for env var expansion)
echo ""
echo "🔍 检查 CMD 格式..."

if grep -q 'CMD sh -c' Dockerfile; then
    echo "✅ CMD 使用 shell form (sh -c)，可以正确扩展环境变量"
elif grep -q 'CMD \[' Dockerfile; then
    echo "⚠️  CMD 使用 exec form，可能无法正确扩展 PORT 环境变量"
    echo "   建议使用: CMD sh -c \"node server.js\""
else
    echo "⚠️  无法确定 CMD 格式"
fi

# Check for FFmpeg installation
echo ""
echo "🔍 检查 FFmpeg 安装..."

if grep -q "ffmpeg" Dockerfile; then
    echo "✅ Dockerfile 包含 FFmpeg 安装"
else
    echo "⚠️  Dockerfile 未安装 FFmpeg（视频处理可能需要）"
fi

# Check if package.json exists
echo ""
echo "🔍 检查依赖文件..."

if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在（Dockerfile 需要它）"
    exit 1
fi

if [ -f "package-lock.json" ]; then
    echo "✅ package-lock.json 存在（npm ci 需要它）"
else
    echo "⚠️  package-lock.json 不存在（建议运行 npm install 生成）"
fi

# Check server.js exists
if [ -f "server.js" ]; then
    echo "✅ server.js 存在"
else
    echo "❌ server.js 不存在（应用入口文件）"
    exit 1
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Dockerfile 验证总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Dockerfile 基本结构正确"
echo "✅ 包含所有必需组件"
echo ""
echo "💡 手动测试步骤（如果已安装 Docker）:"
echo ""
echo "1. 构建镜像:"
echo "   docker build -t flo-ski-coach-test ."
echo ""
echo "2. 运行容器（测试 PORT 环境变量）:"
echo "   docker run -p 8000:8000 -e PORT=8000 -e GEMINI_API_KEY=your_key flo-ski-coach-test"
echo ""
echo "3. 检查日志:"
echo "   查看容器输出，确认服务器在端口 8000 启动"
echo ""
echo "4. 测试应用:"
echo "   curl http://localhost:8000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

