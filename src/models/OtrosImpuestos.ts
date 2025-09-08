import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement,
  DataType, 
  CreatedAt
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'otros_impuestos',
  timestamps: false,
  createdAt: 'created_at'
})
export class OtrosImpuestos extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'impuesto_id'
  })
  impuestoId!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'detalle_id',
    allowNull: false
  })
  detalleId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  codigo!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false
  })
  valor!: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false
  })
  tasa!: number;

  @CreatedAt
  @Column({
    field: 'created_at'
  })
  declare createdAt: Date;

  // Association will be defined separately
  detalleCompra!: any;
}