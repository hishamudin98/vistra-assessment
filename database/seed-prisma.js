const { PrismaClient } = require('./generated/client');

const prisma = new PrismaClient();

// Import seed modules
const seedUsers = require('./seeds/users');
const seedRoles = require('./seeds/roles');
const seedPermissions = require('./seeds/permissions');

async function main() {
  console.log('Starting database seeding...\n');

  // Run seed modules in order
  await seedUsers(prisma);
  await seedRoles(prisma);
  await seedPermissions(prisma);

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
