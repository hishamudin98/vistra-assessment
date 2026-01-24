/**
 * Seed permissions and role-permission mappings
 */
module.exports = async function seedPermissions(prisma) {
  console.log('Seeding permissions...');

  const permissions = await prisma.permission.createMany({
    data: [
      { name: 'users.create', resource: 'users', action: 'create', description: 'Create new users' },
      { name: 'users.read', resource: 'users', action: 'read', description: 'View user information' },
      { name: 'users.update', resource: 'users', action: 'update', description: 'Update user information' },
      { name: 'users.delete', resource: 'users', action: 'delete', description: 'Delete users' },
      { name: 'roles.manage', resource: 'roles', action: 'manage', description: 'Manage roles and permissions' },
      { name: 'content.create', resource: 'content', action: 'create', description: 'Create content' },
      { name: 'content.read', resource: 'content', action: 'read', description: 'View content' },
      { name: 'content.update', resource: 'content', action: 'update', description: 'Update content' },
      { name: 'content.delete', resource: 'content', action: 'delete', description: 'Delete content' },
      { name: 'content.moderate', resource: 'content', action: 'moderate', description: 'Moderate content' },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${permissions.count} permissions`);

  // Assign permissions to roles
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  const moderatorRole = await prisma.role.findUnique({ where: { name: 'moderator' } });

  const allPermissions = await prisma.permission.findMany();

  // Admin gets all permissions
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`✓ Assigned all permissions to admin role`);

  // User gets limited permissions
  const userPermissions = allPermissions.filter(p =>
    ['content.read', 'content.create', 'users.read'].includes(p.name)
  );

  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`✓ Assigned permissions to user role`);

  // Moderator gets moderate permissions
  const moderatorPermissions = allPermissions.filter(p =>
    ['content.read', 'content.create', 'content.update', 'content.moderate', 'users.read'].includes(p.name)
  );

  for (const permission of moderatorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: moderatorRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(`✓ Assigned permissions to moderator role`);
};
