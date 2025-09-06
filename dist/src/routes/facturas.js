import express from 'express';
import * as facturasController from '../controllers/Facturas.controller.js';
const router = express.Router();
router.get('/', facturasController.getAllFacturas);
router.get('/:id', facturasController.getFacturaById);
router.post('/', facturasController.createFactura);
router.put('/:id', facturasController.updateFactura);
router.delete('/:id', facturasController.deleteFactura);
export default router;
//# sourceMappingURL=facturas.js.map