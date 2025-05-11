import { PrismaClient } from '@prisma/client';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn', 'info'],
    datasources: {
      db: {
        url: process.env.MONGODB_URI
      }
    }
  });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Add connection error handling
prisma.$on('query', (e) => {
  console.log('Query:', e.query);
  console.log('Params:', e.params);
  console.log('Duration:', `${e.duration}ms`);
});

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

export default prisma; 