-- Remove any existing database and user.
DROP DATABASE IF EXISTS scheduler;
DROP USER IF EXISTS scheduler_user@localhost;

-- Create Scheduler database and user. Ensure Unicode is fully supported.
CREATE DATABASE scheduler CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER scheduler_user@localhost IDENTIFIED WITH mysql_native_password BY 'pw123';
GRANT ALL PRIVILEGES ON scheduler.* TO scheduler_user@localhost;