import { Request, Response } from 'express';
import { Notas, DetalleCompras } from '../models/index.js';

// Get all notas with related purchase details
export const getAllNotas = async (req: Request, res: Response): Promise<void> => {
  try {
    const notas = await Notas.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Manually fetch related DetalleCompras for each nota
    const notasWithDetails = await Promise.all(
      notas.map(async (nota) => {
        try {
          // Validate that the nota has all required composite key values
          if (!nota.rutProveedor || !nota.folio || !nota.tipoDte) {
            console.warn(`Nota ${nota.notaId} has missing composite key values:`, {
              rutProveedor: nota.rutProveedor,
              folio: nota.folio,
              tipoDte: nota.tipoDte
            });
            return {
              ...nota.toJSON(),
              detalleCompra: null
            };
          }

          const detalleCompra = await DetalleCompras.findOne({
            where: {
              rutProveedor: nota.rutProveedor,
              folio: nota.folio,
              tipoDte: nota.tipoDte
            },
            attributes: ['detalleId', 'folio', 'rutProveedor', 'tipoDte', 'fechaEmision', 'montoTotal']
          });
          
          return {
            ...nota.toJSON(),
            detalleCompra: detalleCompra ? detalleCompra.toJSON() : null
          };
        } catch (error) {
          console.error(`Error fetching detalleCompra for nota ${nota.notaId}:`, error);
          return {
            ...nota.toJSON(),
            detalleCompra: null
          };
        }
      })
    );
    
    res.json(notasWithDetails);
  } catch (error) {
    console.error('Error fetching notas:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get nota by composite key (rut_proveedor, folio, tipo_dte)
export const getNotaByCompositeKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rutProveedor, folio, tipoDte } = req.params;
    
    // Validate required parameters
    if (!rutProveedor || !folio || !tipoDte) {
      res.status(400).json({ 
        error: 'Missing required parameters', 
        details: { rutProveedor, folio, tipoDte } 
      });
      return;
    }
    
    // Validate tipoDte is a valid number
    const tipoDteNum = parseInt(tipoDte);
    if (isNaN(tipoDteNum)) {
      res.status(400).json({ 
        error: 'Invalid tipoDte parameter', 
        details: { tipoDte } 
      });
      return;
    }
    
    const nota = await Notas.findOne({
      where: { 
        rutProveedor,
        folio,
        tipoDte: tipoDteNum
      }
    });
    
    if (!nota) {
      res.status(404).json({ error: 'Nota not found' });
      return;
    }
    
    // Manually fetch related DetalleCompras
    try {
      const detalleCompra = await DetalleCompras.findOne({
        where: {
          rutProveedor: nota.rutProveedor,
          folio: nota.folio,
          tipoDte: nota.tipoDte
        },
        attributes: ['detalleId', 'folio', 'rutProveedor', 'tipoDte', 'fechaEmision', 'montoTotal']
      });
      
      res.json({
        ...nota.toJSON(),
        detalleCompra: detalleCompra ? detalleCompra.toJSON() : null
      });
    } catch (detalleError) {
      console.error('Error fetching related DetalleCompras:', detalleError);
      // Still return the nota even if we can't fetch the related detalleCompra
      res.json({
        ...nota.toJSON(),
        detalleCompra: null
      });
    }
  } catch (error) {
    console.error('Error fetching nota:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create nota
export const createNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rutProveedor, folio, tipoDte, comentario, contabilizado } = req.body;
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { rutProveedor, folio, tipoDte }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    // Check if nota already exists
    const existingNota = await Notas.findOne({ 
      where: { rutProveedor, folio, tipoDte } 
    });
    
    if (existingNota) {
      res.status(400).json({ error: 'Nota already exists for this detalle' });
      return;
    }
    
    const nota = await Notas.create({
      rutProveedor,
      folio,
      tipoDte,
      comentario,
      contabilizado: contabilizado || false
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
    const { rutProveedor, folio, tipoDte } = req.params;
    const { comentario, contabilizado } = req.body;
    
    const nota = await Notas.findOne({ 
      where: { 
        rutProveedor, 
        folio, 
        tipoDte: parseInt(tipoDte) 
      } 
    });
    
    if (!nota) {
      res.status(404).json({ error: 'Nota not found' });
      return;
    }
    
    const updateData: any = {};
    if (comentario !== undefined) updateData.comentario = comentario;
    if (contabilizado !== undefined) updateData.contabilizado = contabilizado;
    
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
    const { rutProveedor, folio, tipoDte } = req.params;
    const { comentario } = req.body;
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { rutProveedor, folio, tipoDte: parseInt(tipoDte) }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    let nota = await Notas.findOne({ 
      where: { 
        rutProveedor, 
        folio, 
        tipoDte: parseInt(tipoDte) 
      } 
    });
    
    if (!nota) {
      // Create nota if it doesn't exist
      nota = await Notas.create({
        rutProveedor,
        folio,
        tipoDte: parseInt(tipoDte),
        comentario,
        contabilizado: false
      });
    } else {
      // Update existing nota
      await nota.update({ comentario });
    }
    
    res.json({ 
      message: 'Comment updated successfully',
      rutProveedor,
      folio,
      tipoDte: parseInt(tipoDte),
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
    const { rutProveedor, folio, tipoDte } = req.params;
    const { contabilizado } = req.body;
    
    // Validate the contabilizado value
    if (typeof contabilizado !== 'boolean') {
      res.status(400).json({ error: 'contabilizado must be a boolean value' });
      return;
    }
    
    // Check if detalle_compras exists
    const detalleCompra = await DetalleCompras.findOne({
      where: { rutProveedor, folio, tipoDte: parseInt(tipoDte) }
    });
    
    if (!detalleCompra) {
      res.status(400).json({ error: 'DetalleCompras not found' });
      return;
    }
    
    let nota = await Notas.findOne({ 
      where: { 
        rutProveedor, 
        folio, 
        tipoDte: parseInt(tipoDte) 
      } 
    });
    
    if (!nota) {
      // Create nota if it doesn't exist
      nota = await Notas.create({
        rutProveedor,
        folio,
        tipoDte: parseInt(tipoDte),
        comentario: null,
        contabilizado
      });
    } else {
      // Update existing nota
      await nota.update({ contabilizado });
    }
    
    res.json({ 
      message: 'Contabilizado status updated successfully',
      rutProveedor,
      folio,
      tipoDte: parseInt(tipoDte),
      contabilizado
    });
  } catch (error) {
    console.error('Error updating contabilizado status:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete nota
export const deleteNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rutProveedor, folio, tipoDte } = req.params;
    
    const nota = await Notas.findOne({ 
      where: { 
        rutProveedor, 
        folio, 
        tipoDte: parseInt(tipoDte) 
      } 
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