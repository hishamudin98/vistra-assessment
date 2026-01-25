const { PrismaClient } = require('./generated/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

// Load config based on environment
const env = process.env.NODE_ENV || 'development';
let config;

if (env === 'production') {
  config = require('./prisma.prod.config.js');
} else if (env === 'staging') {
  config = require('./prisma.staging.config.js');
} else {
  config = require('./prisma.dev.config.js');
}

// Parse MySQL connection string to MariaDB connection options
// Format: mysql://user:password@host:port/database
const url = new URL(config.datasource.url);

const connection = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1), // Remove leading '/'
};

const adapter = new PrismaMariaDb(connection);

const prisma = new PrismaClient({ adapter });

// Import seed modules
const seedUsers = require('./seeds/users');
const seedFileSystemItems = require('./seeds/fileSystemItems');

async function main() {
  console.log('Starting database seeding...\n');

  // Run seed modules in order
  await seedUsers(prisma);
  await seedFileSystemItems(prisma);

  console.log('\n✓ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

