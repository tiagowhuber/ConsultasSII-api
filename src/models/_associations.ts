import { Empresa } from './Empresa.js';
import { Periodo } from './Periodo.js';
import { TipoDte } from './TipoDte.js';
import { Proveedor } from './Proveedor.js';
import { ResumenCompras } from './ResumenCompras.js';
import { DetalleCompras } from './DetalleCompras.js';
import { OtrosImpuestos } from './OtrosImpuestos.js';

export const initializeAssociations = () => {
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
