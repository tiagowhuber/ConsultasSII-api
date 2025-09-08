var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, CreatedAt, UpdatedAt, Unique } from 'sequelize-typescript';
let Periodo = class Periodo extends Model {
    periodoId;
    rutEmpresa;
    periodo;
    anio;
    mes;
    nombreMes;
    dia;
    // Associations will be defined separately
    empresa;
    resumenCompras;
    detalleCompras;
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column({
        type: DataType.INTEGER,
        field: 'periodo_id'
    }),
    __metadata("design:type", Number)
], Periodo.prototype, "periodoId", void 0);
__decorate([
    Column({
        type: DataType.STRING(12),
        field: 'rut_empresa',
        allowNull: false
    }),
    __metadata("design:type", String)
], Periodo.prototype, "rutEmpresa", void 0);
__decorate([
    Unique('unique_rut_periodo'),
    Column({
        type: DataType.STRING(6),
        allowNull: false,
        validate: {
            is: /^\d{6}$/ // Format: YYYYMM
        }
    }),
    __metadata("design:type", String)
], Periodo.prototype, "periodo", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], Periodo.prototype, "anio", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12
        }
    }),
    __metadata("design:type", Number)
], Periodo.prototype, "mes", void 0);
__decorate([
    Column({
        type: DataType.STRING(20),
        field: 'nombre_mes',
        allowNull: false
    }),
    __metadata("design:type", String)
], Periodo.prototype, "nombreMes", void 0);
__decorate([
    Column({
        type: DataType.INTEGER
    }),
    __metadata("design:type", Number)
], Periodo.prototype, "dia", void 0);
__decorate([
    CreatedAt,
    Column({
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], Periodo.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column({
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], Periodo.prototype, "updatedAt", void 0);
Periodo = __decorate([
    Table({
        schema: 'dte',
        tableName: 'periodo',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
], Periodo);
export { Periodo };
//# sourceMappingURL=Periodo.js.map