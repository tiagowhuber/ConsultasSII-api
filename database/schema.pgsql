-- Chilean DTE (Documento Tributario Electrónico) Database Schema
DROP SCHEMA IF EXISTS dte CASCADE;
CREATE SCHEMA IF NOT EXISTS dte;

-- Companies/Entities table
CREATE TABLE IF NOT EXISTS dte.empresa (
    rut_empresa VARCHAR(12) NOT NULL,
    nombre_empresa VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rut_empresa)
);

-- Tax periods table
CREATE TABLE IF NOT EXISTS dte.periodo (
    periodo_id SERIAL PRIMARY KEY,
    rut_empresa VARCHAR(12) NOT NULL,
    periodo VARCHAR(6) NOT NULL, -- Format: YYYYMM (e.g., 202508)
    anio INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    nombre_mes VARCHAR(20) NOT NULL,
    dia INTEGER NULL, -- Can be null for monthly periods
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_periodo_empresa FOREIGN KEY (rut_empresa) REFERENCES dte.empresa (rut_empresa),
    UNIQUE (rut_empresa, periodo)
);

-- Document types (DTE types)
CREATE TABLE IF NOT EXISTS dte.tipo_dte (
    tipo_dte INTEGER PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    categoria VARCHAR(20) CHECK (categoria IN ('factura', 'boleta', 'nota_credito', 'nota_debito', 'guia_despacho', 'otros'))
);

-- Suppliers/Providers table
CREATE TABLE IF NOT EXISTS dte.proveedor (
    rut_proveedor VARCHAR(12) PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase summaries by document type and period
CREATE TABLE IF NOT EXISTS dte.resumen_compras (
    resumen_id SERIAL PRIMARY KEY,
    periodo_id INTEGER NOT NULL,
    tipo_dte INTEGER NOT NULL,
    total_documentos INTEGER NOT NULL DEFAULT 0,
    monto_exento BIGINT NOT NULL DEFAULT 0, -- Amounts in Chilean pesos (integer to avoid precision issues)
    monto_neto BIGINT NOT NULL DEFAULT 0,
    iva_recuperable BIGINT NOT NULL DEFAULT 0,
    iva_uso_comun BIGINT NOT NULL DEFAULT 0,
    iva_no_recuperable BIGINT NOT NULL DEFAULT 0,
    monto_total BIGINT NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Confirmada', 'Pendiente', 'Rechazada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumen_compras_periodo FOREIGN KEY (periodo_id) REFERENCES dte.periodo (periodo_id) ON DELETE CASCADE,
    CONSTRAINT fk_resumen_compras_tipo_dte FOREIGN KEY (tipo_dte) REFERENCES dte.tipo_dte (tipo_dte),
    UNIQUE (periodo_id, tipo_dte, estado)
);

-- Detailed purchase records
CREATE TABLE IF NOT EXISTS dte.detalle_compras (
    detalle_id SERIAL PRIMARY KEY,
    periodo_id INTEGER NOT NULL,
    tipo_dte INTEGER NOT NULL,
    tipo_compra VARCHAR(50) NOT NULL DEFAULT 'Del Giro',
    rut_proveedor VARCHAR(12) NOT NULL,
    folio BIGINT NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_recepcion TIMESTAMP NOT NULL,
    acuse_recibo VARCHAR(50),
    fecha_acuse TIMESTAMP NULL,
    
    -- Amounts (in Chilean pesos as integers)
    monto_exento BIGINT NOT NULL DEFAULT 0,
    monto_neto BIGINT NOT NULL DEFAULT 0,
    monto_iva_recuperable BIGINT NOT NULL DEFAULT 0,
    monto_iva_no_recuperable BIGINT NOT NULL DEFAULT 0,
    codigo_iva_no_recuperable INTEGER DEFAULT 0,
    monto_total BIGINT NOT NULL DEFAULT 0,
    
    -- Fixed asset amounts
    monto_neto_activo_fijo BIGINT NOT NULL DEFAULT 0,
    iva_activo_fijo BIGINT NOT NULL DEFAULT 0,
    iva_uso_comun BIGINT NOT NULL DEFAULT 0,
    
    -- Additional tax information
    impuesto_sin_derecho_credito BIGINT NOT NULL DEFAULT 0,
    iva_no_retenido BIGINT NOT NULL DEFAULT 0,
    
    -- Tobacco taxes
    tabacos_puros BIGINT NULL,
    tabacos_cigarrillos BIGINT NULL,
    tabacos_elaborados BIGINT NULL,
    
    -- Credit/debit notes
    nce_nde_factura_compra BIGINT NOT NULL DEFAULT 0,
    
    -- Other taxes (legacy fields for backward compatibility)
    valor_otro_impuesto VARCHAR(20),
    tasa_otro_impuesto VARCHAR(10),
    codigo_otro_impuesto INTEGER DEFAULT 0,
    
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Confirmada', 'Pendiente', 'Rechazada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_detalle_compras_periodo FOREIGN KEY (periodo_id) REFERENCES dte.periodo (periodo_id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_compras_tipo_dte FOREIGN KEY (tipo_dte) REFERENCES dte.tipo_dte (tipo_dte),
    CONSTRAINT fk_detalle_compras_proveedor FOREIGN KEY (rut_proveedor) REFERENCES dte.proveedor (rut_proveedor),
    UNIQUE (rut_proveedor, folio, tipo_dte) -- Prevents duplicate documents
);

-- Other taxes detail (normalized from the otrosImpuestos array)
CREATE TABLE IF NOT EXISTS dte.otros_impuestos (
    impuesto_id SERIAL PRIMARY KEY,
    detalle_id INTEGER NOT NULL,
    codigo INTEGER NOT NULL,
    valor BIGINT NOT NULL,
    tasa DECIMAL(5,2) NOT NULL, -- Tax rate as percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otros_impuestos_detalle FOREIGN KEY (detalle_id) REFERENCES dte.detalle_compras (detalle_id) ON DELETE CASCADE
);

-- Sales summaries (structure ready for when sales data is available)
CREATE TABLE IF NOT EXISTS dte.resumen_ventas (
    resumen_id SERIAL PRIMARY KEY,
    periodo_id INTEGER NOT NULL,
    tipo_dte INTEGER NOT NULL,
    total_documentos INTEGER NOT NULL DEFAULT 0,
    monto_exento BIGINT NOT NULL DEFAULT 0,
    monto_neto BIGINT NOT NULL DEFAULT 0,
    iva_debito_fiscal BIGINT NOT NULL DEFAULT 0,
    monto_total BIGINT NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Confirmada', 'Pendiente', 'Rechazada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumen_ventas_periodo FOREIGN KEY (periodo_id) REFERENCES dte.periodo (periodo_id) ON DELETE CASCADE,
    CONSTRAINT fk_resumen_ventas_tipo_dte FOREIGN KEY (tipo_dte) REFERENCES dte.tipo_dte (tipo_dte)
);

-- Sales detail table (structure ready for when sales data is available)
CREATE TABLE IF NOT EXISTS dte.detalle_ventas (
    detalle_id SERIAL PRIMARY KEY,
    periodo_id INTEGER NOT NULL,
    tipo_dte INTEGER NOT NULL,
    rut_cliente VARCHAR(12) NOT NULL,
    razon_social_cliente VARCHAR(255),
    folio BIGINT NOT NULL,
    fecha_emision DATE NOT NULL,
    monto_exento BIGINT NOT NULL DEFAULT 0,
    monto_neto BIGINT NOT NULL DEFAULT 0,
    iva_debito_fiscal BIGINT NOT NULL DEFAULT 0,
    monto_total BIGINT NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Confirmada', 'Pendiente', 'Rechazada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_ventas_periodo FOREIGN KEY (periodo_id) REFERENCES dte.periodo (periodo_id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_ventas_tipo_dte FOREIGN KEY (tipo_dte) REFERENCES dte.tipo_dte (tipo_dte)
);

-- Create indexes for better performance
CREATE INDEX idx_periodo_rut_empresa ON dte.periodo (rut_empresa);
CREATE INDEX idx_periodo_anio_mes ON dte.periodo (anio, mes);
CREATE INDEX idx_resumen_compras_periodo ON dte.resumen_compras (periodo_id);
CREATE INDEX idx_resumen_compras_tipo_dte ON dte.resumen_compras (tipo_dte);
CREATE INDEX idx_detalle_compras_periodo ON dte.detalle_compras (periodo_id);
CREATE INDEX idx_detalle_compras_proveedor ON dte.detalle_compras (rut_proveedor);
CREATE INDEX idx_detalle_compras_fecha_emision ON dte.detalle_compras (fecha_emision);
CREATE INDEX idx_detalle_compras_fecha_recepcion ON dte.detalle_compras (fecha_recepcion);
CREATE INDEX idx_detalle_compras_folio ON dte.detalle_compras (folio);
CREATE INDEX idx_otros_impuestos_detalle ON dte.otros_impuestos (detalle_id);

-- Insert common DTE types
INSERT INTO dte.tipo_dte (tipo_dte, descripcion, categoria) VALUES
(33, 'FACTURA ELECTRÓNICA', 'factura'),
(34, 'FACTURA NO AFECTA O EXENTA ELECTRÓNICA', 'factura'),
(39, 'BOLETA ELECTRÓNICA', 'boleta'),
(41, 'BOLETA NO AFECTA O EXENTA ELECTRÓNICA', 'boleta'),
(43, 'LIQUIDACIÓN FACTURA ELECTRÓNICA', 'factura'),
(46, 'FACTURA DE COMPRA ELECTRÓNICA', 'factura'),
(52, 'GUÍA DE DESPACHO ELECTRÓNICA', 'guia_despacho'),
(56, 'NOTA DE DÉBITO ELECTRÓNICA', 'nota_debito'),
(61, 'NOTA DE CRÉDITO ELECTRÓNICA', 'nota_credito')
ON CONFLICT (tipo_dte) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION dte.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON dte.empresa FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_periodo_updated_at BEFORE UPDATE ON dte.periodo FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_proveedor_updated_at BEFORE UPDATE ON dte.proveedor FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_resumen_compras_updated_at BEFORE UPDATE ON dte.resumen_compras FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_detalle_compras_updated_at BEFORE UPDATE ON dte.detalle_compras FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_resumen_ventas_updated_at BEFORE UPDATE ON dte.resumen_ventas FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();
CREATE TRIGGER update_detalle_ventas_updated_at BEFORE UPDATE ON dte.detalle_ventas FOR EACH ROW EXECUTE FUNCTION dte.update_updated_at_column();