import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement,
  DataType, 
  CreatedAt, 
  UpdatedAt,
  //ForeignKey,
  //BelongsTo,
  //Unique
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'resumen_compras',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class ResumenCompras extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'resumen_id'
  })
  resumenId!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'periodo_id',
    allowNull: false
  })
  periodoId!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'tipo_dte',
    allowNull: false
  })
  tipoDte!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'total_documentos',
    defaultValue: 0,
    allowNull: false
  })
  totalDocumentos!: number;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_exento',
    defaultValue: 0,
    allowNull: false
  })
  montoExento!: string;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_neto',
    defaultValue: 0,
    allowNull: false
  })
  montoNeto!: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_recuperable',
    defaultValue: 0,
    allowNull: false
  })
  ivaRecuperable!: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_uso_comun',
    defaultValue: 0,
    allowNull: false
  })
  ivaUsoComun!: string;

  @Column({
    type: DataType.BIGINT,
    field: 'iva_no_recuperable',
    defaultValue: 0,
    allowNull: false
  })
  ivaNoRecuperable!: string;

  @Column({
    type: DataType.BIGINT,
    field: 'monto_total',
    defaultValue: 0,
    allowNull: false
  })
  montoTotal!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false
  })
  estado!: string;

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
}