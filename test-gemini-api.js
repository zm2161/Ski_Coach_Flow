// Quick test script to check which Gemini models are available
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY 环境变量未设置！');
  console.error('请在 .env 文件中设置 GEMINI_API_KEY，或通过环境变量传入');
  process.exit(1);
}
console.log('✅ API Key loaded (length:', API_KEY.length, ')');
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = [
  'gemini-2.5-flash',  // Current model used in server.js
  'models/gemini-2.5-flash',  // With models/ prefix
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'gemini-pro',
  'models/gemini-pro'
];

async function testModels() {
  console.log('Testing Gemini API with different model names...\n');
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello"');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} - SUCCESS!`);
      console.log(`   Response: ${text.substring(0, 50)}...\n`);
      return modelName; // Return first working model
    } catch (error) {
      const errorMsg = error.message || error.toString();
      console.log(`❌ ${modelName} - FAILED: ${errorMsg.substring(0, 100)}`);
      // Show full error for debugging
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        console.log(`   (Model not found - this is normal for unavailable models)`);
      } else if (errorMsg.includes('API key') || errorMsg.includes('expired') || errorMsg.includes('invalid')) {
        console.log(`   ⚠️  API key issue - check your key`);
      }
      console.log('');
    }
  }
  
  console.log('\n⚠️  None of the models worked. The API key may be invalid or may not have access to Gemini models.');
  console.log('Please check:');
  console.log('1. Your API key is correct: https://makersuite.google.com/app/apikey');
  console.log('2. The Generative Language API is enabled in your Google Cloud project');
  console.log('3. Your API key has the necessary permissions');
}

testModels().catch(console.error);


