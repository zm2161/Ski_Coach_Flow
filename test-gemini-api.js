// Quick test script to check which Gemini models are available
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDZWUEqfCe8ZA2jVulhioiNtgz1-yIGCL4';
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'models/gemini-pro',
  'gemini-pro-001',
  'gemini-1.5-flash-001'
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
      console.log(`❌ ${modelName} - FAILED: ${error.message.substring(0, 80)}...\n`);
    }
  }
  
  console.log('\n⚠️  None of the models worked. The API key may be invalid or may not have access to Gemini models.');
  console.log('Please check:');
  console.log('1. Your API key is correct: https://makersuite.google.com/app/apikey');
  console.log('2. The Generative Language API is enabled in your Google Cloud project');
  console.log('3. Your API key has the necessary permissions');
}

testModels().catch(console.error);

