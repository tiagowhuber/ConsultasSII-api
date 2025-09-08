import { Router } from 'express';
import {
  getAllEmpresas,
  getEmpresaByRut,
  createEmpresa,
  getPeriodosByEmpresa,
  createPeriodo,
  getResumenCompras,
  createResumenCompras,
  getDetalleCompras,
  createDetalleCompras,
  getAllProveedores,
  createProveedor,
  getAllTiposDte
} from '../controllers/Dte.controller.js';

const router = Router();

// Empresa routes
router.get('/empresas', getAllEmpresas);
router.get('/empresas/:rut', getEmpresaByRut);
router.post('/empresas', createEmpresa);

// Periodo routes
router.get('/empresas/:rutEmpresa/periodos', getPeriodosByEmpresa);
router.post('/periodos', createPeriodo);

// Resumen compras routes
router.get('/resumen-compras', getResumenCompras);
router.get('/resumen-compras/:periodoId', getResumenCompras);
router.post('/resumen-compras', createResumenCompras);

// Detalle compras routes
router.get('/detalle-compras', getDetalleCompras);
router.get('/detalle-compras/:periodoId', getDetalleCompras);
router.post('/detalle-compras', createDetalleCompras);

// Proveedor routes
router.get('/proveedores', getAllProveedores);
router.post('/proveedores', createProveedor);

// Tipo DTE routes
router.get('/tipos-dte', getAllTiposDte);

export default router;