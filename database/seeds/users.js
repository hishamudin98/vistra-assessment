/**
 * Seed users data
 */
module.exports = async function seedUsers(prisma) {
  console.log('Seeding users...');

  // Example: Create sample users
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
      },
      {
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        username: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${users.count} users`);
};
