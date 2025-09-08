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
import { initializeAssociations } from './_associations.js';

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

// Initialize associations
initializeAssociations();

export { sequelize };
export default models;