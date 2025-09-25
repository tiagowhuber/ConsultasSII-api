import { Router } from 'express';
import {
  getAllNotas,
  getNotaByCompositeKey,
  createNota,
  updateNota,
  updateNotaComment,
  updateNotaContabilizado,
  deleteNota
} from '../controllers/Notas.controller.js';

const router = Router();

// Notas routes using composite key (rut_proveedor, folio, tipo_dte)
router.get('/notas', getAllNotas);
router.get('/notas/:rutProveedor/:folio/:tipoDte', getNotaByCompositeKey);
router.post('/notas', createNota);
router.put('/notas/:rutProveedor/:folio/:tipoDte', updateNota);
router.put('/notas/:rutProveedor/:folio/:tipoDte/comment', updateNotaComment);
router.put('/notas/:rutProveedor/:folio/:tipoDte/contabilizado', updateNotaContabilizado);
router.delete('/notas/:rutProveedor/:folio/:tipoDte', deleteNota);

export default router;