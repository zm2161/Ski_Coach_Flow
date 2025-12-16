#!/bin/bash
# Monitor AI Builder deployment status

SERVICE_NAME="flo-ski-coach"
MAX_ATTEMPTS=20
ATTEMPT=0
INTERVAL=30

echo "🔍 监控部署状态: $SERVICE_NAME"
echo "   每 $INTERVAL 秒检查一次，最多检查 $MAX_ATTEMPTS 次"
echo ""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  echo "[$ATTEMPT/$MAX_ATTEMPTS] 检查部署状态..."
  
  node check-deployment-status.js
  
  STATUS=$(node -e "const fetch = require('node-fetch'); const token = 'sk_5cd8ba7f_d128a16e30bfd823186c4a28bd49ea20463d'; fetch('https://space.ai-builders.com/backend/v1/deployments/$SERVICE_NAME', { headers: { 'Authorization': \`Bearer \${token}\` } }).then(r => r.json()).then(d => console.log(d.status)).catch(e => console.log('ERROR'));" 2>/dev/null)
  
  if [ "$STATUS" = "HEALTHY" ]; then
    echo ""
    echo "✅ 部署成功！服务已健康运行"
    echo "   URL: https://$SERVICE_NAME.ai-builders.space/"
    exit 0
  elif [ "$STATUS" = "ERROR" ] || [ "$STATUS" = "UNHEALTHY" ]; then
    echo ""
    echo "❌ 部署失败或服务不健康"
    echo "   请检查日志获取详细信息"
    exit 1
  fi
  
  if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
    echo "   等待 $INTERVAL 秒后再次检查..."
    sleep $INTERVAL
    echo ""
  fi
done

echo ""
echo "⏰ 已达到最大检查次数"
echo "   请手动运行: node check-deployment-status.js"

