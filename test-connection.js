import 'reflect-metadata';
import dotenv from 'dotenv';
import { testConnection } from './src/config/db.js';

dotenv.config();

async function quickTest() {
  try {
    console.log('🔧 Testing Sequelize connection...');
    await testConnection();
    console.log('🎉 Success! Sequelize setup is working.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 PostgreSQL might not be running on port', process.env.PGPORT);
      console.log('💡 Check if PostgreSQL service is running');
    }
  }
}

quickTest();