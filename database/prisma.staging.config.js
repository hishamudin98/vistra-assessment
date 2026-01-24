const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  datasource: {
    url: 'mysql://vistra_user:Vistra@123456@staging-db.example.com:3306/vistra_db_staging',
  },
});
