import { Model } from 'sequelize-typescript';
export declare class TipoDte extends Model {
    tipoDte: number;
    descripcion: string;
    categoria: 'factura' | 'boleta' | 'nota_credito' | 'nota_debito' | 'guia_despacho' | 'otros';
}
