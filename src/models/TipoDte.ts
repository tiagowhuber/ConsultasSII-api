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
  tableName: 'tipo_dte',
  timestamps: false
})
export class TipoDte extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    field: 'tipo_dte'
  })
  tipoDte!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  descripcion!: string;

  @Column({
    type: DataType.ENUM('factura', 'boleta', 'nota_credito', 'nota_debito', 'guia_despacho', 'otros'),
    allowNull: false
  })
  categoria!: 'factura' | 'boleta' | 'nota_credito' | 'nota_debito' | 'guia_despacho' | 'otros';
}