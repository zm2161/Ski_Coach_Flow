// Simple API key test
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('❌ API key not found in .env file');
  process.exit(1);
}

console.log('🔑 Testing API key...');
console.log('   Length:', key.length);
console.log('   Fingerprint:', key.substring(0, 10) + '...' + key.substring(key.length - 10));
console.log('');

const genAI = new GoogleGenerativeAI(key);

// Try different model names (including the one used in server.js)
const modelsToTry = [
  'gemini-2.0-flash-exp',  // Try experimental models
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro'
];

async function testKey() {
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello"');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log(`   Response: ${text}`);
      console.log('');
      console.log('🎉 API Key 有效！可以使用。');
      return true;
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('API key') || errorMsg.includes('expired') || errorMsg.includes('invalid') || errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('400')) {
        console.log(`❌ ${modelName} - API key error:`);
        console.log(`   完整错误: ${errorMsg}`);
        console.log('');
        // Check if it's specifically an API key issue
        if (errorMsg.includes('expired') || errorMsg.includes('API_KEY_INVALID')) {
          console.log('⚠️  API key 已过期或无效');
        } else if (errorMsg.includes('400')) {
          console.log('⚠️  400 Bad Request - 可能是 API key 问题或模型不可用');
        }
        console.log('   请检查: https://makersuite.google.com/app/apikey');
        return false;
      }
      // Model not found is OK, try next one
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        console.log(`   (Model ${modelName} not available, trying next...)`);
        continue;
      }
      // Other errors
      console.log(`   Error: ${errorMsg.substring(0, 100)}`);
    }
  }
  
  console.log('⚠️  所有模型都测试失败');
  return false;
}

testKey().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ 测试过程中出错:', err.message);
  process.exit(1);
});

