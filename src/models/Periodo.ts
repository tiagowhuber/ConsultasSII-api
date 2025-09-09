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
  //HasMany,
  Unique
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'periodo',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class Periodo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'periodo_id'
  })
  periodoId!: number;

  @Unique('unique_rut_periodo')
  @Column({
    type: DataType.STRING(12),
    field: 'rut_empresa',
    allowNull: false
  })
  rutEmpresa!: string;

  @Unique('unique_rut_periodo')
  @Column({
    type: DataType.STRING(6),
    allowNull: false,
    validate: {
      is: /^\d{6}$/ // Format: YYYYMM
    }
  })
  periodo!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  anio!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  })
  mes!: number;

  @Column({
    type: DataType.STRING(20),
    field: 'nombre_mes',
    allowNull: false
  })
  nombreMes!: string;

  @Column({
    type: DataType.INTEGER
  })
  dia?: number;

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
  empresa!: any;
  resumenCompras!: any[];
  detalleCompras!: any[];
}