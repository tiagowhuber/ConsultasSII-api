var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, PrimaryKey, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
let Empresa = class Empresa extends Model {
    rutEmpresa;
    nombreEmpresa;
    direccion;
    telefono;
    email;
    // Associations will be defined separately to avoid circular dependency
    periodos;
};
__decorate([
    PrimaryKey,
    Column({
        type: DataType.STRING(12),
        field: 'rut_empresa'
    }),
    __metadata("design:type", String)
], Empresa.prototype, "rutEmpresa", void 0);
__decorate([
    Column({
        type: DataType.STRING(255),
        field: 'nombre_empresa'
    }),
    __metadata("design:type", String)
], Empresa.prototype, "nombreEmpresa", void 0);
__decorate([
    Column({
        type: DataType.STRING(255)
    }),
    __metadata("design:type", String)
], Empresa.prototype, "direccion", void 0);
__decorate([
    Column({
        type: DataType.STRING(20)
    }),
    __metadata("design:type", String)
], Empresa.prototype, "telefono", void 0);
__decorate([
    Column({
        type: DataType.STRING(100)
    }),
    __metadata("design:type", String)
], Empresa.prototype, "email", void 0);
__decorate([
    CreatedAt,
    Column({
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], Empresa.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column({
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], Empresa.prototype, "updatedAt", void 0);
Empresa = __decorate([
    Table({
        schema: 'dte',
        tableName: 'empresa',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
], Empresa);
export { Empresa };
//# sourceMappingURL=Empresa.js.map