-- Grant permissions to vistra_user for Prisma shadow database
-- MySQL 8 requires ALL PRIVILEGES on *.* to create databases
GRANT ALL PRIVILEGES ON *.* TO 'vistra_user'@'%';
FLUSH PRIVILEGES;
