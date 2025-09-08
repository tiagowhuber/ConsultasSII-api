-- Create the facturas table
CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(255),
    fecha DATE,
    cliente VARCHAR(255),
    importe DECIMAL(10, 2),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numero);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente);

-- Insert some sample data (optional)
INSERT INTO facturas (numero, fecha, cliente, importe, descripcion, estado) VALUES
    ('F001', '2024-01-15', 'Cliente A', 150.00, 'Servicio de consultoría', 'pagada'),
    ('F002', '2024-01-20', 'Cliente B', 300.50, 'Desarrollo web', 'pendiente'),
    ('F003', '2024-01-25', 'Cliente C', 75.25, 'Mantenimiento', 'vencida')
ON CONFLICT DO NOTHING;