import { Request, Response } from 'express';

// Define interfaces for type safety
interface Factura {
    id: number;
    [key: string]: any;
}

// Simple in-memory store for demo/testing purposes
let facturas: Factura[] = [];
let nextId = 1;

export const getAllFacturas = (req: Request, res: Response): void => {
    res.json(facturas);
};

export const getFacturaById = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const factura = facturas.find(f => f.id === id);
    if (!factura) {
        res.status(404).json({ error: 'Factura not found' });
        return;
    }
    res.json(factura);
};

export const createFactura = (req: Request, res: Response): void => {
    const data = req.body || {};
    const nueva: Factura = { id: nextId++, ...data };
    facturas.push(nueva);
    res.status(201).json(nueva);
};

export const updateFactura = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const idx = facturas.findIndex(f => f.id === id);
    if (idx === -1) {
        res.status(404).json({ error: 'Factura not found' });
        return;
    }
    facturas[idx] = { ...facturas[idx], ...req.body };
    res.json(facturas[idx]);
};

export const deleteFactura = (req: Request, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const idx = facturas.findIndex(f => f.id === id);
    if (idx === -1) {
        res.status(404).json({ error: 'Factura not found' });
        return;
    }
    const removed = facturas.splice(idx, 1)[0];
    res.json(removed);
};