import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  DataType, 
  CreatedAt, 
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'proveedor',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Proveedor extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(12),
    field: 'rut_proveedor'
  })
  rutProveedor!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'razon_social',
    allowNull: false
  })
  razonSocial!: string;

  @Column({
    type: DataType.STRING(255)
  })
  direccion?: string;

  @Column({
    type: DataType.STRING(20)
  })
  telefono?: string;

  @Column({
    type: DataType.STRING(100)
  })
  email?: string;

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
}