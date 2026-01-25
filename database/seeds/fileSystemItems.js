
module.exports = async function seedFileSystemItems(prisma) {
  console.log('Seeding file system items...');

  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('⚠ No users found. Please seed users first.');
    return;
  }

  const fileSystemItems = await prisma.fileSystemItem.createMany({
    data: [
      {
        name: 'Documents',
        type: 'folder',
        path: '/documents',
        userId: user.id,
        parentId: null,
      },
      {
        name: 'Photos',
        type: 'folder',
        path: '/photos',
        userId: user.id,
        parentId: null,
      },
      {
        name: 'report.pdf',
        type: 'file',
        path: '/documents/report.pdf',
        size: 2048576,
        mimeType: 'application/pdf',
        userId: user.id,
        parentId: null,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✓ Created ${fileSystemItems.count} file system items`);
};
