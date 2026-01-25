const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'schema.prisma',
  migrations: {
    seed: 'node seed-prisma.js',
  },
  datasource: {
    url: 'mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db',
  },
});
