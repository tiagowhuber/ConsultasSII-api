import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  DataType, 
  CreatedAt, 
  UpdatedAt,
  //HasMany
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'empresa',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Empresa extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(12),
    field: 'rut_empresa'
  })
  rutEmpresa!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'nombre_empresa'
  })
  nombreEmpresa?: string;

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

  // Associations will be defined separately to avoid circular dependency
  periodos!: any[];
}