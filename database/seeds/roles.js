/**
 * Seed roles data
 */
module.exports = async function seedRoles(prisma) {
  console.log('Seeding roles...');

  const roles = await prisma.role.createMany({
    data: [
      {
        name: 'admin',
        description: 'Administrator with full system access',
      },
      {
        name: 'user',
        description: 'Regular user with limited access',
      },
      {
        name: 'moderator',
        description: 'Moderator with content management access',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${roles.count} roles`);
};
