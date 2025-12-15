#!/bin/bash
# Docker 测试命令集合（如果已安装 Docker）

echo "🐳 Dockerfile 测试命令"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣  构建 Docker 镜像:"
echo "   docker build -t flo-ski-coach-test ."
echo ""

echo "2️⃣  运行容器（基本测试）:"
echo "   docker run -p 8000:8000 -e PORT=8000 -e GEMINI_API_KEY=test_key flo-ski-coach-test"
echo ""

echo "3️⃣  运行容器（后台模式，查看日志）:"
echo "   docker run -d --name flo-test -p 8000:8000 -e PORT=8000 -e GEMINI_API_KEY=test_key flo-ski-coach-test"
echo "   docker logs -f flo-test"
echo ""

echo "4️⃣  测试应用响应:"
echo "   curl http://localhost:8000"
echo "   curl http://localhost:8000/api/health"
echo ""

echo "5️⃣  检查容器内环境:"
echo "   docker exec flo-test env | grep PORT"
echo "   docker exec flo-test which ffmpeg"
echo "   docker exec flo-test node --version"
echo ""

echo "6️⃣  清理测试容器:"
echo "   docker stop flo-test"
echo "   docker rm flo-test"
echo "   docker rmi flo-ski-coach-test"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 提示: 如果 Docker 未安装，可以使用 ./test-dockerfile.sh 进行静态验证"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

