const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  datasource: {
    url: 'mysql://vistra_user:Vistra@123456@localhost:3306/vistra_db',
  },
});
