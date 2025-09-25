import { Request, Response } from 'express';
import { 
  Empresa, 
  Periodo, 
  TipoDte, 
  Proveedor, 
  ResumenCompras, 
  DetalleCompras,
  OtrosImpuestos,
  Notas 
} from '../models/index.js';
import { Op } from 'sequelize';

// Empresa Controllers
export const getAllEmpresas = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresas = await Empresa.findAll({
      include: [{
        model: Periodo,
        as: 'periodos',
        limit: 5,
        order: [['anio', 'DESC'], ['mes', 'DESC']]
      }]
    });
    res.json(empresas);
  } catch (error) {
    console.error('Error fetching empresas:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getEmpresaByRut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rut } = req.params;
    const empresa = await Empresa.findByPk(rut, {
      include: [{
        model: Periodo,
        as: 'periodos',
        order: [['anio', 'DESC'], ['mes', 'DESC']]
      }]
    });
    
    if (!empresa) {
      res.status(404).json({ error: 'Empresa not found' });
      return;
    }
    
    res.json(empresa);
  } catch (error) {
    console.error('Error fetching empresa:', error);
    res.status(500).json({ error: 'Database error' });
  }
};


// Periodo Controllers
export const getPeriodosByEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rutEmpresa } = req.params;
    const { anio, mes } = req.query;
    
    const whereClause: any = { rutEmpresa };
    
    if (anio) whereClause.anio = anio;
    if (mes) whereClause.mes = mes;
    
    const periodos = await Periodo.findAll({
      where: whereClause,
      include: [
        { model: Empresa, as: 'empresa' },
        { 
          model: ResumenCompras, 
          as: 'resumenCompras',
          include: [{ model: TipoDte, as: 'tipoDteInfo' }]
        }
      ],
      order: [['anio', 'DESC'], ['mes', 'DESC']]
    });
    
    res.json(periodos);
  } catch (error) {
    console.error('Error fetching periodos:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Resumen Compras Controllers
export const getResumenCompras = async (req: Request, res: Response): Promise<void> => {
  try {
    const { periodoId } = req.params;
    
    const resumen = await ResumenCompras.findAll({
      where: periodoId ? { periodoId } : {},
      include: [
        { 
          model: Periodo, 
          as: 'periodo',
          include: [{ model: Empresa, as: 'empresa' }]
        },
        { model: TipoDte, as: 'tipoDteInfo' }
      ],
      order: [['tipoDte', 'ASC']]
    });
    
    res.json(resumen);
  } catch (error) {
    console.error('Error fetching resumen compras:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Detalle Compras Controllers
export const getDetalleCompras = async (req: Request, res: Response): Promise<void> => {
  try {
    const { periodoId } = req.params;
    const { rutProveedor, tipoDte, fechaInicio, fechaFin, page = 1, limit = 50 } = req.query;
    
    const whereClause: any = {};
    if (periodoId) whereClause.periodoId = periodoId;
    if (rutProveedor) whereClause.rutProveedor = rutProveedor;
    if (tipoDte) whereClause.tipoDte = tipoDte;
    
    if (fechaInicio || fechaFin) {
      whereClause.fechaEmision = {};
      if (fechaInicio) whereClause.fechaEmision[Op.gte] = fechaInicio;
      if (fechaFin) whereClause.fechaEmision[Op.lte] = fechaFin;
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows } = await DetalleCompras.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Periodo, 
          as: 'periodo',
          include: [{ model: Empresa, as: 'empresa' }]
        },
        { model: TipoDte, as: 'tipoDteInfo' },
        { model: Proveedor, as: 'proveedor' },
        { model: OtrosImpuestos, as: 'otrosImpuestos' }
      ],
      order: [['fechaEmision', 'DESC']],
      limit: Number(limit),
      offset
    });
    
    // Manually fetch notas for each detalle using composite key
    const detallesWithNotas = await Promise.all(
      rows.map(async (detalle) => {
        try {
          // Ensure all required values are defined before querying
          if (!detalle.rutProveedor || !detalle.folio || !detalle.tipoDte) {
            console.warn(`Missing composite key values for detalle ${detalle.detalleId}:`, {
              rutProveedor: detalle.rutProveedor,
              folio: detalle.folio,
              tipoDte: detalle.tipoDte
            });
            return {
              ...detalle.toJSON(),
              nota: null
            };
          }

          const nota = await Notas.findOne({
            where: {
              rutProveedor: detalle.rutProveedor,
              folio: detalle.folio,
              tipoDte: detalle.tipoDte
            }
          });
          
          return {
            ...detalle.toJSON(),
            nota: nota ? nota.toJSON() : null
          };
        } catch (error) {
          console.error(`Error fetching nota for detalle ${detalle.detalleId}:`, error);
          return {
            ...detalle.toJSON(),
            nota: null
          };
        }
      })
    );
    
    res.json({
      data: detallesWithNotas,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching detalle compras:', error);
    res.status(500).json({ error: 'Database error' });
  }
};


// Proveedor Controllers
export const getAllProveedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    
    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { rutProveedor: { [Op.iLike]: `%${search}%` } },
        { razonSocial: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const proveedores = await Proveedor.findAll({
      where: whereClause,
      order: [['razonSocial', 'ASC']],
      limit: 100
    });
    
    res.json(proveedores);
  } catch (error) {
    console.error('Error fetching proveedores:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Tipo DTE Controllers
export const getAllTiposDte = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipos = await TipoDte.findAll({
      order: [['tipoDte', 'ASC']]
    });
    res.json(tipos);
  } catch (error) {
    console.error('Error fetching tipos DTE:', error);
    res.status(500).json({ error: 'Database error' });
  }
};