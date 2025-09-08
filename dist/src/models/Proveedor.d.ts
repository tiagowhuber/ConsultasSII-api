import { Model } from 'sequelize-typescript';
export declare class Proveedor extends Model {
    rutProveedor: string;
    razonSocial: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
}
