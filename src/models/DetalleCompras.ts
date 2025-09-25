import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement,
  DataType, 
  CreatedAt, 
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'detalle_compras',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class DetalleCompras extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'detalle_id'
  })
  declare detalleId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'periodo_id',
    allowNull: false
  })
  declare periodoId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'tipo_dte',
    allowNull: false
  })
  declare tipoDte: number;

  @Column({
    type: DataType.STRING(50),
    field: 'tipo_compra',
    defaultValue: 'Del Giro',
    allowNull: false
  })
  declare tipoCompra: string;

  @Column({
    type: DataType.STRING(12),
    field: 'rut_proveedor',
    allowNull: false
  })
  declare rutProveedor: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  declare folio: string;

  @Column({
    type: DataType.DATEONLY,
    field: 'fecha_emision',
    allowNull: false
  })
  declare fechaEmision: Date;

  @Column({
    type: DataType.DATE,
    field: 'fecha_recepcion',
    allowNull: false
  })
  declare fechaRecepcion: Date;

  @Column({
    type: DataType.STRING(50),
    field: 'acuse_recibo'
  })
  declare acuseRecibo?: string;

  @Column({
    type: DataType.DATE,
    field: 'fecha_acuse'
  })
  declare fechaAcuse?: Date;

  // Amounts (in Chilean pesos as strings to handle BIGINT)
  @Column({
    type: DataType.BIGINT,
    field: 'monto_exento',
    defaultValue: 0,
    allowNull: false
  })
  declare montoExento: string;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_neto',
    defaultValue: 0,
    allowNull: false
  })
  declare montoNeto: string;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_iva_recuperable',
    defaultValue: 0,
    allowNull: false
  })
  declare montoIvaRecuperable: string;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_iva_no_recuperable',
    defaultValue: 0,
    allowNull: false
  })
  declare montoIvaNoRecuperable: string;

  @Column({
    type: DataType.INTEGER,
    field: 'codigo_iva_no_recuperable',
    defaultValue: 0
  })
  declare codigoIvaNoRecuperable?: number;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_total',
    defaultValue: 0,
    allowNull: false
  })
  declare montoTotal: string;

  // Fixed asset amounts
  @Column({
    type: DataType.BIGINT,
    field: 'monto_neto_activo_fijo',
    defaultValue: 0,
    allowNull: false
  })
  declare montoNetoActivoFijo: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_activo_fijo',
    defaultValue: 0,
    allowNull: false
  })
  declare ivaActivoFijo: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_uso_comun',
    defaultValue: 0,
    allowNull: false
  })
  declare ivaUsoComun: string;

  // Additional tax information
  @Column({
    type: DataType.BIGINT,
    field: 'impuesto_sin_derecho_credito',
    defaultValue: 0,
    allowNull: false
  })
  declare impuestoSinDerechoCredito: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_no_retenido',
    defaultValue: 0,
    allowNull: false
  })
  declare ivaNoRetenido: string;

  // Tobacco taxes
  @Column({
    type: DataType.BIGINT,
    field: 'tabacos_puros'
  })
  declare tabacosPuros?: string;

  @Column({
    type: DataType.BIGINT,
    field: 'tabacos_cigarrillos'
  })
  declare tabacosCigarrillos?: string;

  @Column({
    type: DataType.BIGINT,
    field: 'tabacos_elaborados'
  })
  declare tabacosElaborados?: string;

  // Credit/debit notes
  @Column({
    type: DataType.BIGINT,
    field: 'nce_nde_factura_compra',
    defaultValue: 0,
    allowNull: false
  })
  declare nceNdeFacturaCompra: string;

  // Other taxes (legacy fields)
  @Column({
    type: DataType.STRING(20),
    field: 'valor_otro_impuesto'
  })
  declare valorOtroImpuesto?: string;

  @Column({
    type: DataType.STRING(10),
    field: 'tasa_otro_impuesto'
  })
  declare tasaOtroImpuesto?: string;

  @Column({
    type: DataType.INTEGER,
    field: 'codigo_otro_impuesto',
    defaultValue: 0
  })
  declare codigoOtroImpuesto?: number;

  @Column({
    type: DataType.ENUM('Confirmada', 'Pendiente', 'Rechazada'),
    allowNull: false
  })
  declare estado: 'Confirmada' | 'Pendiente' | 'Rechazada';

  @CreatedAt
  @Column({
    field: 'created_at'
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at'
  })
  declare updatedAt: Date;

  // Associations will be defined separately
  periodo!: any;
  tipoDteInfo!: any;
  proveedor!: any;
  otrosImpuestos!: any[];
}