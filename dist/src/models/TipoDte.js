var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';
let TipoDte = class TipoDte extends Model {
    tipoDte;
    descripcion;
    categoria;
};
__decorate([
    PrimaryKey,
    Column({
        type: DataType.INTEGER,
        field: 'tipo_dte'
    }),
    __metadata("design:type", Number)
], TipoDte.prototype, "tipoDte", void 0);
__decorate([
    Column({
        type: DataType.STRING(100),
        allowNull: false
    }),
    __metadata("design:type", String)
], TipoDte.prototype, "descripcion", void 0);
__decorate([
    Column({
        type: DataType.ENUM('factura', 'boleta', 'nota_credito', 'nota_debito', 'guia_despacho', 'otros'),
        allowNull: false
    }),
    __metadata("design:type", String)
], TipoDte.prototype, "categoria", void 0);
TipoDte = __decorate([
    Table({
        schema: 'dte',
        tableName: 'tipo_dte',
        timestamps: false
    })
], TipoDte);
export { TipoDte };
//# sourceMappingURL=TipoDte.js.map