require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');
const { SequelizeStorage, Umzug } = require('umzug');

const sequelize = new Sequelize(DATABASE_URL);

const migrationConfig = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig);
  const migrations = await migrator.up();

  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConfig);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('connected to the database');
  } catch (error) {
    console.error('failed to connect to the database');
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
