import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import facturasRoutes from './src/routes/facturas.js';
import dteRoutes from './src/routes/dte.js';
import { testConnection } from './src/config/db.js';
import './src/models/index.js'; // Initialize models
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/facturas', facturasRoutes);
app.use('/api/dte', dteRoutes);
const start = async () => {
    try {
        // Test database connection
        await testConnection();
        // Sync database models (don't force in production)
        // Skip sync for now to test basic connection
        // await syncDatabase(process.env.NODE_ENV !== 'production');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 DTE API ready with Sequelize`);
            console.log(`📋 Available endpoints:`);
            console.log(`   GET  /api/dte/empresas`);
            console.log(`   GET  /api/dte/tipos-dte`);
            console.log(`   GET  /facturas (legacy)`);
        });
    }
    catch (err) {
        console.error('❌ Failed to start server:', err);
        console.log('💡 Make sure PostgreSQL is running on port', process.env.PGPORT);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=app.js.map