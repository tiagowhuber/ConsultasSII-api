import { Empresa, Periodo, TipoDte, Proveedor, ResumenCompras, DetalleCompras, OtrosImpuestos } from '../models/index.js';
import { Op } from 'sequelize';
// Empresa Controllers
export const getAllEmpresas = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching empresas:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const getEmpresaByRut = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching empresa:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.create(req.body);
        res.status(201).json(empresa);
    }
    catch (error) {
        console.error('Error creating empresa:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
// Periodo Controllers
export const getPeriodosByEmpresa = async (req, res) => {
    try {
        const { rutEmpresa } = req.params;
        const { anio, mes } = req.query;
        const whereClause = { rutEmpresa };
        if (anio)
            whereClause.anio = anio;
        if (mes)
            whereClause.mes = mes;
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
    }
    catch (error) {
        console.error('Error fetching periodos:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createPeriodo = async (req, res) => {
    try {
        const periodo = await Periodo.create(req.body);
        res.status(201).json(periodo);
    }
    catch (error) {
        console.error('Error creating periodo:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
// Resumen Compras Controllers
export const getResumenCompras = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching resumen compras:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createResumenCompras = async (req, res) => {
    try {
        const resumen = await ResumenCompras.create(req.body);
        res.status(201).json(resumen);
    }
    catch (error) {
        console.error('Error creating resumen compras:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
// Detalle Compras Controllers
export const getDetalleCompras = async (req, res) => {
    try {
        const { periodoId } = req.params;
        const { rutProveedor, tipoDte, fechaInicio, fechaFin, page = 1, limit = 50 } = req.query;
        const whereClause = {};
        if (periodoId)
            whereClause.periodoId = periodoId;
        if (rutProveedor)
            whereClause.rutProveedor = rutProveedor;
        if (tipoDte)
            whereClause.tipoDte = tipoDte;
        if (fechaInicio || fechaFin) {
            whereClause.fechaEmision = {};
            if (fechaInicio)
                whereClause.fechaEmision[Op.gte] = fechaInicio;
            if (fechaFin)
                whereClause.fechaEmision[Op.lte] = fechaFin;
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
        res.json({
            data: rows,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching detalle compras:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createDetalleCompras = async (req, res) => {
    try {
        const { otrosImpuestos, ...detalleData } = req.body;
        const detalle = await DetalleCompras.create(detalleData);
        // Create related otros_impuestos if provided
        if (otrosImpuestos && Array.isArray(otrosImpuestos) && otrosImpuestos.length > 0) {
            const impuestosData = otrosImpuestos.map((impuesto) => ({
                ...impuesto,
                detalleId: detalle.detalleId
            }));
            await OtrosImpuestos.bulkCreate(impuestosData);
        }
        // Fetch the created record with all associations
        const createdDetalle = await DetalleCompras.findByPk(detalle.detalleId, {
            include: [
                { model: Periodo, as: 'periodo' },
                { model: TipoDte, as: 'tipoDteInfo' },
                { model: Proveedor, as: 'proveedor' },
                { model: OtrosImpuestos, as: 'otrosImpuestos' }
            ]
        });
        res.status(201).json(createdDetalle);
    }
    catch (error) {
        console.error('Error creating detalle compras:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
// Proveedor Controllers
export const getAllProveedores = async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = {};
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
    }
    catch (error) {
        console.error('Error fetching proveedores:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.create(req.body);
        res.status(201).json(proveedor);
    }
    catch (error) {
        console.error('Error creating proveedor:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
// Tipo DTE Controllers
export const getAllTiposDte = async (req, res) => {
    try {
        const tipos = await TipoDte.findAll({
            order: [['tipoDte', 'ASC']]
        });
        res.json(tipos);
    }
    catch (error) {
        console.error('Error fetching tipos DTE:', error);
        res.status(500).json({ error: 'Database error' });
    }
};
//# sourceMappingURL=Dte.controller.js.map