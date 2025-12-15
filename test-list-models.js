// Test API key by listing available models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('❌ API key not found');
  process.exit(1);
}

console.log('🔑 Testing API key by listing available models...');
console.log('   Fingerprint:', key.substring(0, 10) + '...' + key.substring(key.length - 10));
console.log('');

const genAI = new GoogleGenerativeAI(key);

// Try to list models using the API
async function testKey() {
  try {
    // Use the REST API directly to list models
    const fetch = require('node-fetch');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log('✅ API Key 有效！');
      console.log(`📋 找到 ${data.models.length} 个可用模型:`);
      console.log('');
      
      // Show first 10 models
      data.models.slice(0, 10).forEach(model => {
        console.log(`   - ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`     支持的方法: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      if (data.models.length > 10) {
        console.log(`   ... 还有 ${data.models.length - 10} 个模型`);
      }
      
      // Try to use one of the models
      const flashModel = data.models.find(m => m.name.includes('flash') || m.name.includes('Flash'));
      if (flashModel) {
        console.log('');
        console.log(`🧪 测试使用模型: ${flashModel.name}`);
        const model = genAI.getGenerativeModel({ model: flashModel.name });
        const result = await model.generateContent('Say "Hello, API key is working!"');
        const text = result.response.text();
        console.log(`✅ 成功！响应: ${text}`);
      }
      
      return true;
    } else {
      console.error('❌ API Key 无效或无法访问');
      console.error('响应:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
    if (error.message.includes('API key') || error.message.includes('invalid') || error.message.includes('401') || error.message.includes('403')) {
      console.error('   ⚠️  API key 无效或已过期');
    }
    return false;
  }
}

testKey().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ 测试失败:', err.message);
  process.exit(1);
});

