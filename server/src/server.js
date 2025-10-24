/**
 * server.js
 * Entry point của server
 */

import app from './app.js';
import appConfig from './config/AppConfig.js';
import mongoClient from './config/MongoClient.js';

async function startServer() {
  try {
    // Kết nối MongoDB
    await mongoClient.connect();

    // Start Express server
    app.listen(appConfig.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🚀 PaperPress Server is running!          ║
║                                                   ║
║        Port: ${appConfig.port}                             ║
║        Environment: ${appConfig.nodeEnv}                ║
║        API: http://localhost:${appConfig.port}/api        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoClient.disconnect();
  process.exit(0);
});

startServer();
