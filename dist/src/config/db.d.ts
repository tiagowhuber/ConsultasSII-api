import { Sequelize } from 'sequelize-typescript';
declare const sequelize: Sequelize;
export declare const testConnection: () => Promise<void>;
export declare const syncDatabase: (force?: boolean) => Promise<void>;
export default sequelize;
