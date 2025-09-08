import { Model } from 'sequelize-typescript';
export declare class ResumenCompras extends Model {
    resumenId: number;
    periodoId: number;
    tipoDte: number;
    totalDocumentos: number;
    montoExento: string;
    montoNeto: string;
    ivaRecuperable: string;
    ivaUsoComun: string;
    ivaNoRecuperable: string;
    montoTotal: string;
    estado: 'Confirmada' | 'Pendiente' | 'Rechazada';
    createdAt: Date;
    updatedAt: Date;
    periodo: any;
    tipoDteInfo: any;
}
