module.exports = async function seedUsers(prisma) {
  console.log('Seeding users...');

  // Example: Create sample users
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'john',
        fullName: 'John Red',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${users.count} users`);
};
