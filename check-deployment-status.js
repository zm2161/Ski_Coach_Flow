// Check AI Builder deployment status
require('dotenv').config();
const fetch = require('node-fetch');

const SERVICE_NAME = 'flo-ski-coach';
const TOKEN = process.env.AI_BUILDER_TOKEN || 'sk_5cd8ba7f_d128a16e30bfd823186c4a28bd49ea20463d';
const API_URL = `https://space.ai-builders.com/backend/v1/deployments/${SERVICE_NAME}`;

async function checkStatus() {
  try {
    console.log(`🔍 检查部署状态: ${SERVICE_NAME}`);
    console.log('');
    
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📊 部署信息:');
    console.log(`   服务名称: ${data.service_name}`);
    console.log(`   状态: ${data.status}`);
    console.log(`   消息: ${data.message}`);
    console.log(`   仓库: ${data.repo_url}`);
    console.log(`   分支: ${data.branch}`);
    console.log(`   端口: ${data.port}`);
    
    if (data.public_url) {
      console.log(`   🌐 公共 URL: ${data.public_url}`);
    }
    
    if (data.last_deployed_at) {
      console.log(`   ⏰ 最后部署: ${new Date(data.last_deployed_at).toLocaleString()}`);
    }
    
    if (data.koyeb_status) {
      console.log(`   🔧 Koyeb 状态: ${data.koyeb_status}`);
    }
    
    console.log('');
    
    if (data.status === 'HEALTHY') {
      console.log('✅ 部署成功！服务运行正常');
      console.log(`   访问: ${data.public_url}`);
    } else if (data.status === 'deploying' || data.status === 'queued') {
      console.log('⏳ 部署进行中，请稍候...');
      console.log('   通常需要 5-10 分钟');
    } else if (data.status === 'ERROR' || data.status === 'UNHEALTHY') {
      console.log('❌ 部署失败或服务不健康');
      console.log(`   错误信息: ${data.message}`);
    }
    
    if (data.suggested_actions && data.suggested_actions.length > 0) {
      console.log('');
      console.log('💡 建议操作:');
      data.suggested_actions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 检查状态失败:', error.message);
    process.exit(1);
  }
}

checkStatus();

