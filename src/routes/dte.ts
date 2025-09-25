import { Router } from 'express';
import {
  getAllEmpresas,
  getEmpresaByRut,
  getPeriodosByEmpresa,
  getResumenCompras,
  getDetalleCompras,
  getAllProveedores,
  getAllTiposDte,
  updateDetalleCompraComment,
  updateDetalleCompraContabilizado
} from '../controllers/Dte.controller.js';

const router = Router();

// Empresa routes
router.get('/empresas', getAllEmpresas);
router.get('/empresas/:rut', getEmpresaByRut);

// Periodo routes
router.get('/empresas/:rutEmpresa/periodos', getPeriodosByEmpresa);

// Resumen compras routes
router.get('/resumen-compras', getResumenCompras);
router.get('/resumen-compras/:periodoId', getResumenCompras);

// Detalle compras routes
router.get('/detalle-compras', getDetalleCompras);
router.get('/detalle-compras/:periodoId', getDetalleCompras);

// Proveedor routes
router.get('/proveedores', getAllProveedores);

// Tipo DTE routes
router.get('/tipos-dte', getAllTiposDte);

// Comment routes
router.put('/detalle-compras/:detalleId/comment', updateDetalleCompraComment);

// Contabilizado routes
router.put('/detalle-compras/:detalleId/contabilizado', updateDetalleCompraContabilizado);

export default router;