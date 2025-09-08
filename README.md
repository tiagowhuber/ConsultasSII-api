# ConsultasSII API

A Node.js/Express API for managing DTE (Documento Tributario Electrónico) data for the Chilean SII (Servicio de Impuestos Internos) system.

## Project Structure

```
src/
├── config/
│   └── db.ts           # Database configuration
├── controllers/
│   └── Dte.controller.ts # DTE-related controllers
├── models/             # Sequelize models
│   ├── index.ts        # Models export and associations
│   ├── Empresa.ts      # Company model
│   ├── Periodo.ts      # Period model
│   ├── TipoDte.ts      # DTE type model
│   ├── Proveedor.ts    # Supplier model
│   ├── ResumenCompras.ts    # Purchase summary model
│   ├── DetalleCompras.ts    # Purchase detail model
│   └── OtrosImpuestos.ts    # Other taxes model
└── routes/
    └── dte.ts          # API routes
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. Set up your PostgreSQL database and update `.env` with your credentials.

4. Run the database schema:
   ```bash
   psql -h localhost -p 5431 -U postgres -d postgres -f database/schema.pgsql
   ```

## Development

```bash
# Start development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Clean build directory
npm run clean

# Clean build and rebuild
npm run build:clean
```

## API Endpoints

### Empresas (Companies)
- `GET /api/dte/empresas` - Get all companies
- `GET /api/dte/empresas/:rut` - Get company by RUT
- `POST /api/dte/empresas` - Create new company

### Periodos (Periods)
- `GET /api/dte/empresas/:rutEmpresa/periodos` - Get periods by company
- `POST /api/dte/periodos` - Create new period

### Resumen Compras (Purchase Summary)
- `GET /api/dte/resumen-compras` - Get all purchase summaries
- `GET /api/dte/resumen-compras/:periodoId` - Get summaries by period
- `POST /api/dte/resumen-compras` - Create purchase summary

### Detalle Compras (Purchase Details)
- `GET /api/dte/detalle-compras` - Get all purchase details
- `GET /api/dte/detalle-compras/:periodoId` - Get details by period
- `POST /api/dte/detalle-compras` - Create purchase detail

### Proveedores (Suppliers)
- `GET /api/dte/proveedores` - Get all suppliers
- `POST /api/dte/proveedores` - Create new supplier

### Tipos DTE (DTE Types)
- `GET /api/dte/tipos-dte` - Get all DTE types

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize with sequelize-typescript
- **Development**: nodemon, ts-node