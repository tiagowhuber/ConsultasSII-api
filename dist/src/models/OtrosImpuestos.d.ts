import { Model } from 'sequelize-typescript';
export declare class OtrosImpuestos extends Model {
    impuestoId: number;
    detalleId: number;
    codigo: number;
    valor: string;
    tasa: number;
    createdAt: Date;
    detalleCompra: any;
}
