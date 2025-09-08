import { Model } from 'sequelize-typescript';
export declare class Periodo extends Model {
    periodoId: number;
    rutEmpresa: string;
    periodo: string;
    anio: number;
    mes: number;
    nombreMes: string;
    dia?: number;
    createdAt: Date;
    updatedAt: Date;
    empresa: any;
    resumenCompras: any[];
    detalleCompras: any[];
}
