import { Model } from 'sequelize-typescript';
export declare class Empresa extends Model {
    rutEmpresa: string;
    nombreEmpresa?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
    periodos: any[];
}
