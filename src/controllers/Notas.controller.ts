import { Request, Response } from 'express';
import { Notas, DetalleCompras } from '../models/index.js';

// Get all notas with related purchase details
export const getAllNotas = async (req: Request, res: Response): Promise<void> => {
  try {
    const notas = await Notas.findAll({
      include: [
        { 
          model: DetalleCompras, 
          as: 'detalleCompra',
          attributes: ['detalleId', 'folio', 'rutProveedor', 'tipoDte', 'fechaEmision', 'montoTotal']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(notas);
  } catch (error) {
    console.error('Error fetching notas:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get nota by folio
export const getNotaByFolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    
    // First find the detalle_compras record to get the detalleId
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(404).json({ error: 'DetalleCompras not found for this folio' });
      return;
    }
    
    const nota = await Notas.findOne({
      where: { detalleId: detalleCompra.detalleId },
      include: [
        { 
          model: DetalleCompras, 
          as: 'detalleCompra',
          attributes: ['detalleId', 'folio', 'rutProveedor', 'tipoDte', 'fechaEmision', 'montoTotal']
        }
      ]
    });
    
    if (!nota) {
      res.status(404).json({ error: 'Nota not found' });
      return;
    }
    
    res.json(nota);
  } catch (error) {
    console.error('Error fetching nota:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create nota
export const createNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio, comentario, contabilizado, pagado } = req.body;
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    // Check if nota already exists
    const existingNota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (existingNota) {
      res.status(400).json({ error: 'Nota already exists for this detalle' });
      return;
    }
    
    const nota = await Notas.create({
      detalleId: detalleCompra.detalleId,
      folio,
      comentario,
      contabilizado: contabilizado || false,
      pagado: pagado || false
    });
    
    res.status(201).json(nota);
  } catch (error) {
    console.error('Error creating nota:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update nota
export const updateNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    const { comentario, contabilizado, pagado } = req.body;
    
    // First find the detalle_compras record to get the detalleId
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(404).json({ error: 'DetalleCompras not found for this folio' });
      return;
    }
    
    const nota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (!nota) {
      res.status(404).json({ error: 'Nota not found' });
      return;
    }
    
    const updateData: any = {};
    if (comentario !== undefined) updateData.comentario = comentario;
    if (contabilizado !== undefined) updateData.contabilizado = contabilizado;
    if (pagado !== undefined) updateData.pagado = pagado;
    
    await nota.update(updateData);
    
    res.json(nota);
  } catch (error) {
    console.error('Error updating nota:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update nota comment
export const updateNotaComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    const { comentario } = req.body;
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    let nota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (!nota) {
      // Create nota if it doesn't exist
      nota = await Notas.create({
        detalleId: detalleCompra.detalleId,
        folio,
        comentario,
        contabilizado: false
      });
    } else {
      // Update existing nota
      await nota.update({ comentario });
    }
    
    res.json({ 
      message: 'Comment updated successfully',
      folio,
      comentario
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update nota contabilizado status
export const updateNotaContabilizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    const { contabilizado } = req.body;
    
    // Validate the contabilizado value
    if (typeof contabilizado !== 'boolean') {
      res.status(400).json({ error: 'contabilizado must be a boolean value' });
      return;
    }
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    let nota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (!nota) {
      // Create nota if it doesn't exist
      nota = await Notas.create({
        detalleId: detalleCompra.detalleId,
        folio,
        comentario: null,
        contabilizado
      });
    } else {
      // Update existing nota
      await nota.update({ contabilizado });
    }
    
    res.json({ 
      message: 'Contabilizado status updated successfully',
      folio,
      contabilizado
    });
  } catch (error) {
    console.error('Error updating contabilizado status:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update nota pagado status
export const updateNotaPagado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    const { pagado } = req.body;
    
    // Validate the pagado value
    if (typeof pagado !== 'boolean') {
      res.status(400).json({ error: 'pagado must be a boolean value' });
      return;
    }
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    let nota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (!nota) {
      // Create nota if it doesn't exist
      nota = await Notas.create({
        detalleId: detalleCompra.detalleId,
        folio,
        comentario: null,
        contabilizado: false,
        pagado
      });
    } else {
      // Update existing nota
      await nota.update({ pagado });
    }
    
    res.json({ 
      message: 'Pagado status updated successfully',
      folio,
      pagado
    });
  } catch (error) {
    console.error('Error updating pagado status:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete nota
export const deleteNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folio } = req.params;
    
    // First find the detalle_compras record to get the detalleId
    const detalleCompra = await DetalleCompras.findOne({
      where: { folio }
    });
    
    if (!detalleCompra) {
      res.status(404).json({ error: 'DetalleCompras not found for this folio' });
      return;
    }
    
    const nota = await Notas.findOne({ 
      where: { detalleId: detalleCompra.detalleId } 
    });
    
    if (!nota) {
      res.status(404).json({ error: 'Nota not found' });
      return;
    }
    
    await nota.destroy();
    
    res.json({ message: 'Nota deleted successfully' });
  } catch (error) {
    console.error('Error deleting nota:', error);
    res.status(500).json({ error: 'Database error' });
  }
};