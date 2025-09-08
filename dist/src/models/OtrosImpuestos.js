var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt } from 'sequelize-typescript';
let OtrosImpuestos = class OtrosImpuestos extends Model {
    impuestoId;
    detalleId;
    codigo;
    valor;
    tasa;
    // Association will be defined separately
    detalleCompra;
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column({
        type: DataType.INTEGER,
        field: 'impuesto_id'
    }),
    __metadata("design:type", Number)
], OtrosImpuestos.prototype, "impuestoId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'detalle_id',
        allowNull: false
    }),
    __metadata("design:type", Number)
], OtrosImpuestos.prototype, "detalleId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], OtrosImpuestos.prototype, "codigo", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        allowNull: false
    }),
    __metadata("design:type", String)
], OtrosImpuestos.prototype, "valor", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(5, 2),
        allowNull: false
    }),
    __metadata("design:type", Number)
], OtrosImpuestos.prototype, "tasa", void 0);
__decorate([
    CreatedAt,
    Column({
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], OtrosImpuestos.prototype, "createdAt", void 0);
OtrosImpuestos = __decorate([
    Table({
        schema: 'dte',
        tableName: 'otros_impuestos',
        timestamps: false,
        createdAt: 'created_at'
    })
], OtrosImpuestos);
export { OtrosImpuestos };
//# sourceMappingURL=OtrosImpuestos.js.map