import { Sequelize } from 'sequelize-typescript';
const sequelize = new Sequelize({
    database: process.env.PGDATABASE || 'postgres',
    dialect: 'postgres',
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5431,
    define: {
        schema: 'dte',
        timestamps: true,
        underscored: true
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
export const testConnection = async () => {
    try {
        console.log(' Attempting Sequelize connection to:', {
            host: process.env.PGHOST || 'localhost',
            port: Number(process.env.PGPORT) || 5431,
            database: process.env.PGDATABASE || 'postgres',
            user: process.env.PGUSER
        });
        await sequelize.authenticate();
        console.log(' Sequelize: PostgreSQL connection OK');
    }
    catch (error) {
        console.error(' Unable to connect to the database:', error);
        throw error;
    }
};
export const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log(' Database synchronized successfully');
    }
    catch (error) {
        console.error(' Error synchronizing database:', error);
        throw error;
    }
};
export default sequelize;
//# sourceMappingURL=db.js.map