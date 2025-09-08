var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
let ResumenCompras = class ResumenCompras extends Model {
    resumenId;
    periodoId;
    tipoDte;
    totalDocumentos;
    montoExento;
    montoNeto;
    ivaRecuperable;
    ivaUsoComun;
    ivaNoRecuperable;
    montoTotal;
    estado;
    // Associations will be defined separately
    periodo;
    tipoDteInfo;
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column({
        type: DataType.INTEGER,
        field: 'resumen_id'
    }),
    __metadata("design:type", Number)
], ResumenCompras.prototype, "resumenId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'periodo_id',
        allowNull: false
    }),
    __metadata("design:type", Number)
], ResumenCompras.prototype, "periodoId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'tipo_dte',
        allowNull: false
    }),
    __metadata("design:type", Number)
], ResumenCompras.prototype, "tipoDte", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'total_documentos',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", Number)
], ResumenCompras.prototype, "totalDocumentos", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_exento',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "montoExento", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_neto',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "montoNeto", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_recuperable',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "ivaRecuperable", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_uso_comun',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "ivaUsoComun", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_no_recuperable',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "ivaNoRecuperable", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_total',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "montoTotal", void 0);
__decorate([
    Column({
        type: DataType.ENUM('Confirmada', 'Pendiente', 'Rechazada'),
        allowNull: false
    }),
    __metadata("design:type", String)
], ResumenCompras.prototype, "estado", void 0);
__decorate([
    CreatedAt,
    Column({
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], ResumenCompras.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column({
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], ResumenCompras.prototype, "updatedAt", void 0);
ResumenCompras = __decorate([
    Table({
        schema: 'dte',
        tableName: 'resumen_compras',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
], ResumenCompras);
export { ResumenCompras };
//# sourceMappingURL=ResumenCompras.js.map