import sequelize from '../config/db.js';
export const getAllFacturas = async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM facturas ORDER BY id');
        res.json(results);
    }
    catch (err) {
        console.error('Error fetching facturas:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
export const getFacturaById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [results] = await sequelize.query('SELECT * FROM facturas WHERE id = $1', {
            replacements: [id]
        });
        if (results.length === 0) {
            res.status(404).json({ error: 'Factura not found' });
            return;
        }
        res.json(results[0]);
    }
    catch (err) {
        console.error('Error fetching factura:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
export const createFactura = async (req, res) => {
    try {
        const data = req.body || {};
        // Build dynamic insert query based on provided fields
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const insertQuery = `INSERT INTO facturas (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const [results] = await sequelize.query(insertQuery, {
            replacements: values
        });
        res.status(201).json(results[0]);
    }
    catch (err) {
        console.error('Error creating factura:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
export const updateFactura = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updateData = req.body || {};
        // Build dynamic update query
        const fields = Object.keys(updateData);
        if (fields.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = [...Object.values(updateData), id];
        const updateQuery = `UPDATE facturas SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
        const [results] = await sequelize.query(updateQuery, {
            replacements: values
        });
        if (results.length === 0) {
            res.status(404).json({ error: 'Factura not found' });
            return;
        }
        res.json(results[0]);
    }
    catch (err) {
        console.error('Error updating factura:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
export const deleteFactura = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [results] = await sequelize.query('DELETE FROM facturas WHERE id = $1 RETURNING *', {
            replacements: [id]
        });
        if (results.length === 0) {
            res.status(404).json({ error: 'Factura not found' });
            return;
        }
        res.json(results[0]);
    }
    catch (err) {
        console.error('Error deleting factura:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
//# sourceMappingURL=Facturas.controller.js.map