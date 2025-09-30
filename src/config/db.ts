import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';

const sequelize = new Sequelize({
  database: process.env.PGDATABASE || 'postgres',
  dialect: 'postgres',
  dialectModule: pg,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5431,
  define: {
    schema: 'dte',
    timestamps: true,
    underscored: true
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    // Database connection successful
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    // Database synchronized
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export default sequelize;