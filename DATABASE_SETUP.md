# ConsultasSII API - Chilean DTE Database with Sequelize

## Overview
This API manages Chilean DTE (Documento Tributario Electrónico) data using Sequelize ORM with PostgreSQL. The system handles tax documents, purchase summaries, and detailed transaction records according to Chilean tax regulations.

## Prerequisites

1. **PostgreSQL 12+** installed on your system
2. **Node.js 18+** and **npm** installed

## Database Setup

### 1. Create Database and User
```sql
-- Connect to PostgreSQL as admin user
CREATE DATABASE consultassii;
CREATE USER consultassii_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE consultassii TO consultassii_user;
\q
```

### 2. Run Database Schema
```bash
# Connect to the database and run the DTE schema
psql -U consultassii_user -d consultassii -f database/schema.pgsql
```

## Environment Configuration

### 1. Create .env file
```bash
cp .env.example .env
```

### 2. Update .env with your credentials
```env
PGHOST=localhost
PGPORT=5432
PGUSER=consultassii_user
PGPASSWORD=your_secure_password
PGDATABASE=consultassii
PORT=3000
NODE_ENV=development
```

## Installation and Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build and Start Production
```bash
npm run build
npm start
```

## API Endpoints

### DTE Endpoints (New)

#### Empresas (Companies)
- `GET /api/dte/empresas` - Get all companies
- `GET /api/dte/empresas/:rut` - Get company by RUT
- `POST /api/dte/empresas` - Create new company

#### Períodos (Tax Periods)
- `GET /api/dte/empresas/:rutEmpresa/periodos` - Get periods by company
- `POST /api/dte/periodos` - Create new period

#### Resumen de Compras (Purchase Summaries)
- `GET /api/dte/resumen-compras/:periodoId?` - Get purchase summaries
- `POST /api/dte/resumen-compras` - Create purchase summary

#### Detalle de Compras (Purchase Details)
- `GET /api/dte/detalle-compras/:periodoId?` - Get detailed purchases (with pagination)
- `POST /api/dte/detalle-compras` - Create detailed purchase record

#### Proveedores (Suppliers)
- `GET /api/dte/proveedores` - Get all suppliers (with search)
- `POST /api/dte/proveedores` - Create new supplier

#### Tipos de DTE (Document Types)
- `GET /api/dte/tipos-dte` - Get all DTE types

### Legacy Endpoints
- `GET /facturas` - Get all facturas (legacy)
- `GET /facturas/:id` - Get factura by ID (legacy)
- `POST /facturas` - Create new factura (legacy)
- `PUT /facturas/:id` - Update factura (legacy)
- `DELETE /facturas/:id` - Delete factura (legacy)

## Database Schema (DTE)

The system uses the `dte` schema with the following main tables:

### Core Tables
- **`dte.empresa`** - Companies/Entities
- **`dte.periodo`** - Tax periods (monthly/yearly)
- **`dte.tipo_dte`** - Document types (Factura, Boleta, etc.)
- **`dte.proveedor`** - Suppliers/Providers

### Transaction Tables
- **`dte.resumen_compras`** - Purchase summaries by period and document type
- **`dte.detalle_compras`** - Detailed purchase records
- **`dte.otros_impuestos`** - Additional tax details (normalized)

### Future Ready
- **`dte.resumen_ventas`** - Sales summaries (structure ready)
- **`dte.detalle_ventas`** - Sales details (structure ready)

## Sequelize Models

All models are TypeScript-based with decorators:
- Full type safety
- Automatic relationships
- Built-in validation
- Timestamps management

### Key Features
- **Associations**: Proper foreign key relationships
- **Validation**: Business rules enforcement  
- **Pagination**: Built-in for large datasets
- **Search**: Full-text search capabilities
- **Amounts**: BIGINT handling for Chilean peso precision

## Example Usage

### Create a Company
```bash
POST /api/dte/empresas
{
  "rutEmpresa": "12345678-9",
  "nombreEmpresa": "Mi Empresa SPA",
  "direccion": "Av. Libertador 123, Santiago",
  "email": "contacto@miempresa.cl"
}
```

### Create a Tax Period
```bash
POST /api/dte/periodos
{
  "rutEmpresa": "12345678-9",
  "periodo": "202409",
  "anio": 2024,
  "mes": 9,
  "nombreMes": "Septiembre"
}
```

### Add Purchase Detail
```bash
POST /api/dte/detalle-compras
{
  "periodoId": 1,
  "tipoDte": 33,
  "rutProveedor": "87654321-0",
  "folio": 12345,
  "fechaEmision": "2024-09-01",
  "fechaRecepcion": "2024-09-02T10:00:00Z",
  "montoNeto": "100000",
  "montoIvaRecuperable": "19000",
  "montoTotal": "119000",
  "estado": "Confirmada"
}
```

## Startup Messages

Successful startup shows:
```
✓ Sequelize: PostgreSQL connection OK
✓ Database synchronized successfully  
🚀 Server running on port 3000
📊 DTE Schema ready with Sequelize models
```

## Troubleshooting

### Connection Issues
1. Verify PostgreSQL service is running
2. Check credentials in `.env` file
3. Ensure database and schema exist
4. Verify network connectivity

### Schema Issues
```sql
-- Grant schema permissions
GRANT ALL ON SCHEMA dte TO consultassii_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dte TO consultassii_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dte TO consultassii_user;
```

### Sequelize Issues
- Check decorator support in `tsconfig.json`
- Verify all models are imported in `models/index.ts`
- Ensure `reflect-metadata` is imported in `app.ts`

### Development vs Production
- **Development**: Auto-sync models (may drop/recreate)
- **Production**: Manual migrations (preserve data)

## Chilean DTE Integration
This schema supports:
- ✅ SII Libro de Compras format
- ✅ Multiple DTE types (33, 34, 39, 41, etc.)
- ✅ Tax calculations (IVA recuperable/no recuperable)
- ✅ Supplier management
- ✅ Period-based reporting
- 🔄 Future: SII API integration
- 🔄 Future: XML DTE parsing