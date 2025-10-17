import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  DataType, 
  CreatedAt, 
  UpdatedAt,
  AutoIncrement,
  Unique,
  Default
} from 'sequelize-typescript';

@Table({
  schema: 'dte',
  tableName: 'api_call_counter',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class ApiCallCounter extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'counter_id'
  })
  counterId!: number;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'function_name'
  })
  functionName!: string;

  @Default(0)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'call_count',
    get() {
      const value = this.getDataValue('callCount' as any);
      return value ? parseInt(value.toString(), 10) : 0;
    }
  })
  callCount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_called_at'
  })
  lastCalledAt?: Date;

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

  // Static method to increment counter
  static async incrementCounter(functionName: string): Promise<void> {
    const [counter] = await ApiCallCounter.findOrCreate({
      where: { functionName },
      defaults: { 
        functionName, 
        callCount: 0,
        lastCalledAt: new Date()
      }
    });

    await counter.increment('callCount');
    await counter.update({ lastCalledAt: new Date() });
  }

  // Static method to get counter value
  static async getCounter(functionName: string): Promise<number> {
    const counter = await ApiCallCounter.findOne({
      where: { functionName }
    });
    return counter?.callCount || 0;
  }

  // Static method to get all counters
  static async getAllCounters(): Promise<ApiCallCounter[]> {
    return await ApiCallCounter.findAll({
      order: [['functionName', 'ASC']]
    });
  }
}