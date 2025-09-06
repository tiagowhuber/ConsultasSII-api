import express from 'express';
import facturasRoutes from './src/routes/facturas.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/facturas', facturasRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map