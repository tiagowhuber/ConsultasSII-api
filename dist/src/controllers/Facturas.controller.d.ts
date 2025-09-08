import { Request, Response } from 'express';
export declare const getAllFacturas: (req: Request, res: Response) => Promise<void>;
export declare const getFacturaById: (req: Request, res: Response) => Promise<void>;
export declare const createFactura: (req: Request, res: Response) => Promise<void>;
export declare const updateFactura: (req: Request, res: Response) => Promise<void>;
export declare const deleteFactura: (req: Request, res: Response) => Promise<void>;
