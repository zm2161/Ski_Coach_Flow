const ngrok = require('ngrok');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;

async function startServerWithNgrok() {
  // Start the Express server
  console.log('Starting Express server...');
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
  });

  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    // Start ngrok tunnel
    console.log('Starting ngrok tunnel...');
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: null, // Use free tier, or set NGROK_AUTHTOKEN env var
    });

    console.log('\n✅ ===========================================');
    console.log('✅ 服务器已启动！');
    console.log('✅ ===========================================');
    console.log(`✅ 本地地址: http://localhost:${PORT}`);
    console.log(`✅ 公网地址: ${url}`);
    console.log('✅ ===========================================');
    console.log(`\n✅ 分享给朋友的URL: ${url}`);
    console.log('\n按 Ctrl+C 停止服务器\n');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n正在关闭...');
      await ngrok.kill();
      server.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Ngrok错误:', error);
    console.log('提示: 使用 free tier 无需 auth token');
    server.kill();
    process.exit(1);
  }
}

startServerWithNgrok();

