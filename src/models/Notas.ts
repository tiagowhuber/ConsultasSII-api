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
  tableName: 'notas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Notas extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'nota_id'
  })
  declare notaId: number;

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
    type: DataType.INTEGER,
    field: 'tipo_dte',
    allowNull: false
  })
  declare tipoDte: number;

  @Column({
    type: DataType.TEXT
  })
  declare comentario?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  declare contabilizado: boolean;

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
  declare detalleCompra: any;
}