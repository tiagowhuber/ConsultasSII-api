import { Router } from 'express';
import {
  getAllNotas,
  getNotaByFolio,
  createNota,
  updateNota,
  updateNotaComment,
  updateNotaContabilizado,
  updateNotaPagado,
  updateNotaFormaPago,
  deleteNota
} from '../controllers/Notas.controller.js';

const router = Router();

// Notas routes using simple folio key
router.get('/notas', getAllNotas);
router.get('/notas/:folio', getNotaByFolio);
router.post('/notas', createNota);
router.put('/notas/:folio', updateNota);
router.put('/notas/:folio/comment', updateNotaComment);
router.put('/notas/:folio/contabilizado', updateNotaContabilizado);
router.put('/notas/:folio/pagado', updateNotaPagado);
router.put('/notas/:folio/forma-pago', updateNotaFormaPago);
router.delete('/notas/:folio', deleteNota);

export default router;