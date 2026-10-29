import { createApp, prisma } from './app';

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '4000');

async function main() {
  const app = createApp();

  // Connect to database
  await prisma.$connect();
  console.log('✅ Database connected');

  app.listen(PORT, () => {
    console.log(`🚀 TravelBharat API running on http://localhost:${PORT}`);
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
