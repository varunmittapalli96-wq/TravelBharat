try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch {
  // Environment variables are provided directly by the platform in production
}
import { createApp, prisma } from './app';

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '4000');

async function main() {
  const app = createApp();

  // Connect to database
  await prisma.$connect();
  console.log('✅ Database connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TravelBharat API running on http://0.0.0.0:${PORT}`);
    console.log(`📚 API Docs at http://localhost:${PORT}/api/docs`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
