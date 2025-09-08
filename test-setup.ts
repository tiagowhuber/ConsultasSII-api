import 'reflect-metadata';
import dotenv from 'dotenv';
import { testConnection } from './src/config/db';
import { Empresa, Periodo, TipoDte } from './src/models/index';

dotenv.config();

async function testSetup() {
  try {
    console.log('🔧 Testing Sequelize setup...');
    
    // Test connection
    await testConnection();
    
    // Test model queries
    console.log('📊 Testing models...');
    
    // Test TipoDte (should have pre-populated data)
    const tiposDte = await TipoDte.findAll({ limit: 3 });
    console.log(`✅ Found ${tiposDte.length} DTE types`);
    
    // Test Empresa creation (if not exists)
    const [empresa] = await Empresa.findOrCreate({
      where: { rutEmpresa: '12345678-9' },
      defaults: {
        rutEmpresa: '12345678-9',
        nombreEmpresa: 'Empresa de Prueba SPA',
        direccion: 'Av. Test 123, Santiago',
        email: 'test@empresa.cl'
      }
    });
    console.log(`✅ Empresa: ${empresa.nombreEmpresa}`);
    
    // Test Periodo creation
    const [periodo] = await Periodo.findOrCreate({
      where: { 
        rutEmpresa: '12345678-9',
        periodo: '202409'
      },
      defaults: {
        rutEmpresa: '12345678-9',
        periodo: '202409',
        anio: 2024,
        mes: 9,
        nombreMes: 'Septiembre'
      }
    });
    console.log(`✅ Período: ${periodo.nombreMes} ${periodo.anio}`);
    
    console.log('🎉 All tests passed! Sequelize setup is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testSetup();