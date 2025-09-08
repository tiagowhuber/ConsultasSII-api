// Model exports
export { Empresa } from './Empresa.js';
export { Periodo } from './Periodo.js';
export { TipoDte } from './TipoDte.js';
export { Proveedor } from './Proveedor.js';
export { ResumenCompras } from './ResumenCompras.js';
export { DetalleCompras } from './DetalleCompras.js';
export { OtrosImpuestos } from './OtrosImpuestos.js';

// Import sequelize instance
import sequelize from '../config/db.js';
import { Empresa } from './Empresa.js';
import { Periodo } from './Periodo.js';
import { TipoDte } from './TipoDte.js';
import { Proveedor } from './Proveedor.js';
import { ResumenCompras } from './ResumenCompras.js';
import { DetalleCompras } from './DetalleCompras.js';
import { OtrosImpuestos } from './OtrosImpuestos.js';

// Initialize models
const models = {
  Empresa,
  Periodo,
  TipoDte,
  Proveedor,
  ResumenCompras,
  DetalleCompras,
  OtrosImpuestos
};

// Add models to sequelize instance manually
sequelize.addModels([
  Empresa,
  Periodo,
  TipoDte,
  Proveedor,
  ResumenCompras,
  DetalleCompras,
  OtrosImpuestos
]);

// Define associations after models are loaded
const initializeAssociations = () => {
  // Empresa associations
  Empresa.hasMany(Periodo, { foreignKey: 'rutEmpresa', as: 'periodos' });
  
  // Periodo associations
  Periodo.belongsTo(Empresa, { foreignKey: 'rutEmpresa', as: 'empresa' });
  Periodo.hasMany(ResumenCompras, { foreignKey: 'periodoId', as: 'resumenCompras' });
  Periodo.hasMany(DetalleCompras, { foreignKey: 'periodoId', as: 'detalleCompras' });
  
  // ResumenCompras associations
  ResumenCompras.belongsTo(Periodo, { foreignKey: 'periodoId', as: 'periodo' });
  ResumenCompras.belongsTo(TipoDte, { foreignKey: 'tipoDte', as: 'tipoDteInfo' });
  
  // DetalleCompras associations
  DetalleCompras.belongsTo(Periodo, { foreignKey: 'periodoId', as: 'periodo' });
  DetalleCompras.belongsTo(TipoDte, { foreignKey: 'tipoDte', as: 'tipoDteInfo' });
  DetalleCompras.belongsTo(Proveedor, { foreignKey: 'rutProveedor', as: 'proveedor' });
  DetalleCompras.hasMany(OtrosImpuestos, { foreignKey: 'detalleId', as: 'otrosImpuestos' });
  
  // OtrosImpuestos associations
  OtrosImpuestos.belongsTo(DetalleCompras, { foreignKey: 'detalleId', as: 'detalleCompra' });
};

// Initialize associations
initializeAssociations();

export { sequelize, initializeAssociations };
export default models;