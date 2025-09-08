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
let DetalleCompras = class DetalleCompras extends Model {
    detalleId;
    periodoId;
    tipoDte;
    tipoCompra;
    rutProveedor;
    folio;
    fechaEmision;
    fechaRecepcion;
    acuseRecibo;
    fechaAcuse;
    // Amounts (in Chilean pesos as strings to handle BIGINT)
    montoExento;
    montoNeto;
    montoIvaRecuperable;
    montoIvaNoRecuperable;
    codigoIvaNoRecuperable;
    montoTotal;
    // Fixed asset amounts
    montoNetoActivoFijo;
    ivaActivoFijo;
    ivaUsoComun;
    // Additional tax information
    impuestoSinDerechoCredito;
    ivaNoRetenido;
    // Tobacco taxes
    tabacosPuros;
    tabacosCigarrillos;
    tabacosElaborados;
    // Credit/debit notes
    nceNdeFacturaCompra;
    // Other taxes (legacy fields)
    valorOtroImpuesto;
    tasaOtroImpuesto;
    codigoOtroImpuesto;
    estado;
    // Associations will be defined separately
    periodo;
    tipoDteInfo;
    proveedor;
    otrosImpuestos;
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column({
        type: DataType.INTEGER,
        field: 'detalle_id'
    }),
    __metadata("design:type", Number)
], DetalleCompras.prototype, "detalleId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'periodo_id',
        allowNull: false
    }),
    __metadata("design:type", Number)
], DetalleCompras.prototype, "periodoId", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'tipo_dte',
        allowNull: false
    }),
    __metadata("design:type", Number)
], DetalleCompras.prototype, "tipoDte", void 0);
__decorate([
    Column({
        type: DataType.STRING(50),
        field: 'tipo_compra',
        defaultValue: 'Del Giro',
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "tipoCompra", void 0);
__decorate([
    Column({
        type: DataType.STRING(12),
        field: 'rut_proveedor',
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "rutProveedor", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "folio", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
        field: 'fecha_emision',
        allowNull: false
    }),
    __metadata("design:type", Date)
], DetalleCompras.prototype, "fechaEmision", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        field: 'fecha_recepcion',
        allowNull: false
    }),
    __metadata("design:type", Date)
], DetalleCompras.prototype, "fechaRecepcion", void 0);
__decorate([
    Column({
        type: DataType.STRING(50),
        field: 'acuse_recibo'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "acuseRecibo", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        field: 'fecha_acuse'
    }),
    __metadata("design:type", Date)
], DetalleCompras.prototype, "fechaAcuse", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_exento',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoExento", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_neto',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoNeto", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_iva_recuperable',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoIvaRecuperable", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_iva_no_recuperable',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoIvaNoRecuperable", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'codigo_iva_no_recuperable',
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], DetalleCompras.prototype, "codigoIvaNoRecuperable", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_total',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoTotal", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'monto_neto_activo_fijo',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "montoNetoActivoFijo", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_activo_fijo',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "ivaActivoFijo", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_uso_comun',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "ivaUsoComun", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'impuesto_sin_derecho_credito',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "impuestoSinDerechoCredito", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'iva_no_retenido',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "ivaNoRetenido", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'tabacos_puros'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "tabacosPuros", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'tabacos_cigarrillos'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "tabacosCigarrillos", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'tabacos_elaborados'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "tabacosElaborados", void 0);
__decorate([
    Column({
        type: DataType.BIGINT,
        field: 'nce_nde_factura_compra',
        defaultValue: 0,
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "nceNdeFacturaCompra", void 0);
__decorate([
    Column({
        type: DataType.STRING(20),
        field: 'valor_otro_impuesto'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "valorOtroImpuesto", void 0);
__decorate([
    Column({
        type: DataType.STRING(10),
        field: 'tasa_otro_impuesto'
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "tasaOtroImpuesto", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        field: 'codigo_otro_impuesto',
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], DetalleCompras.prototype, "codigoOtroImpuesto", void 0);
__decorate([
    Column({
        type: DataType.ENUM('Confirmada', 'Pendiente', 'Rechazada'),
        allowNull: false
    }),
    __metadata("design:type", String)
], DetalleCompras.prototype, "estado", void 0);
__decorate([
    CreatedAt,
    Column({
        field: 'created_at'
    }),
    __metadata("design:type", Date)
], DetalleCompras.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    Column({
        field: 'updated_at'
    }),
    __metadata("design:type", Date)
], DetalleCompras.prototype, "updatedAt", void 0);
DetalleCompras = __decorate([
    Table({
        schema: 'dte',
        tableName: 'detalle_compras',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
], DetalleCompras);
export { DetalleCompras };
//# sourceMappingURL=DetalleCompras.js.map