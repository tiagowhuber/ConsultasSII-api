import 'reflect-metadata';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log(' Testing database connection...');
    
    // Create Sequelize instance
    const sequelize = new Sequelize({
      database: process.env.PGDATABASE || 'postgres',
      dialect: 'postgres',
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      logging: console.log,
    });

    // Test connection
    await sequelize.authenticate();
    console.log(' Database connection successful');

    // Check if dte schema exists
    const [schemas] = await sequelize.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'dte'");
    
    if (schemas.length === 0) {
      console.log('️  DTE schema not found. Creating it...');
      await sequelize.query('CREATE SCHEMA IF NOT EXISTS dte');
      console.log(' DTE schema created');
    } else {
      console.log(' DTE schema exists');
    }

    // Check if tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'dte' 
      ORDER BY table_name
    `);
    
    if (tables.length === 0) {
      console.log('️  No DTE tables found. You need to run the schema.pgsql file first:');
      console.log('   psql -h localhost -p 5431 -U postgres -d postgres -f database/schema.pgsql');
    } else {
      console.log(` Found ${tables.length} DTE tables:`);
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. dte.${table.table_name}`);
      });
    }

    // Close connection
    await sequelize.close();
    console.log(' Database test completed successfully');
    
  } catch (error) {
    console.error(' Database test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(' Make sure PostgreSQL is running on port', process.env.PGPORT || 5432);
    } else if (error.code === '28P01') {
      console.log(' Authentication failed. Check your username and password in .env');
    } else if (error.code === '3D000') {
      console.log(' Database does not exist. Create it first:');
      console.log('   createdb -h localhost -p 5431 -U postgres consultassii');
    }
    
    process.exit(1);
  }
}

testDatabaseConnection();