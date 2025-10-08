import axios from 'axios';
import type { FormRequest, FormResponse } from '../types/api.js';
import { 
  Empresa, 
  Periodo, 
  TipoDte, 
  Proveedor, 
  ResumenCompras, 
  DetalleCompras, 
  OtrosImpuestos,
  sequelize 
} from '../models/index.js';
import { Transaction, Op } from 'sequelize';
import { notificationService, type NewRecordNotification } from './notificationService.js';

// Create axios instance
const api = axios.create({
  baseURL: 'https://servicios.simpleapi.cl',
  timeout: 300000, // 5 minutes for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock response for testing (use by setting USE_MOCK=true in env)
const MOCK_RESPONSE: FormResponse = {
  caratula: {
    rutEmpresa: '77147627-9',
    nombreMes: 'Agosto',
    mes: 8,
    anio: 2025,
    dia: null,
    periodo: '202508'
  },
  compras: {
    resumenes: [
      {
        tipoDte: 33,
        tipoDteString: 'FACTURA ELECTRÓNICA',
        totalDocumentos: 11,
        montoExento: 0,
        montoNeto: 363885,
        ivaRecuperable: 69141,
        ivaUsoComun: 0,
        ivaNoRecuperable: 0,
        montoTotal: 450658,
        estado: 'Confirmada'
      },
      {
        tipoDte: 34,
        tipoDteString: 'FACTURA NO AFECTA O EXENTA ELECTRÓNICA',
        totalDocumentos: 2,
        montoExento: 3823862,
        montoNeto: 0,
        ivaRecuperable: 0,
        ivaUsoComun: 0,
        ivaNoRecuperable: 0,
        montoTotal: 3823862,
        estado: 'Confirmada'
      }
    ],
    detalleCompras: [
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '76134941-4',
        razonSocial: 'ADMIN. DE SUPERMERCADOS HIPER LIMITADA',
        folio: 78555480,
        fechaEmision: '2025-07-24T00:00:00',
        fechaRecepcion: '2025-07-24T14:06:03',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 24183,
        montoIvaRecuperable: 4595,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 28778,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '76609705-7',
        razonSocial: 'COMERCIALIZADORA Y DISTRIBUIDORA PIZARRO Y HERMANOS LTDA',
        folio: 807668,
        fechaEmision: '2025-07-29T00:00:00',
        fechaRecepcion: '2025-07-29T14:01:16',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 9698,
        montoIvaRecuperable: 1843,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 11541,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '77790860-K',
        razonSocial: 'Masisa Partes y Piezas',
        folio: 377759,
        fechaEmision: '2025-08-04T00:00:00',
        fechaRecepcion: '2025-08-04T15:21:06',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 6810,
        montoIvaRecuperable: 1294,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 8104,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '77790860-K',
        razonSocial: 'Masisa Partes y Piezas',
        folio: 377760,
        fechaEmision: '2025-08-04T00:00:00',
        fechaRecepcion: '2025-08-04T15:22:01',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 108504,
        montoIvaRecuperable: 20616,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 129120,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '78627210-6',
        razonSocial: 'HIPERMERCADOS TOTTUS S.A.',
        folio: 10781420,
        fechaEmision: '2025-08-08T00:00:00',
        fechaRecepcion: '2025-08-08T11:48:37',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 8386,
        montoIvaRecuperable: 1594,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 9980,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '77215640-5',
        razonSocial: 'ADMINISTRADORA DE VENTAS AL DETALLE LTDA',
        folio: 21312952,
        fechaEmision: '2025-08-08T00:00:00',
        fechaRecepcion: '2025-08-08T17:38:57',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 31155,
        montoIvaRecuperable: 5920,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 40765,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '3690',
        tasaOtroImpuesto: '0',
        codigoOtroImpuesto: 28,
        estado: 'Confirmada',
        fechaAcuse: null,
        otrosImpuestos: [
          {
            valor: '3690',
            tasa: '0',
            codigo: 28
          }
        ]
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '77862140-1',
        razonSocial: 'DISTRIBUIDORA DE COMBUSTIBLES ARAUCANIA',
        folio: 504245,
        fechaEmision: '2025-08-12T00:00:00',
        fechaRecepcion: '2025-08-12T10:59:10',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 26887,
        montoIvaRecuperable: 5108,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 35129,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '3134',
        tasaOtroImpuesto: '0',
        codigoOtroImpuesto: 28,
        estado: 'Confirmada',
        fechaAcuse: null,
        otrosImpuestos: [
          {
            valor: '3134',
            tasa: '0',
            codigo: 28
          }
        ]
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '76930995-0',
        razonSocial: 'COMERCIAL JPF LIMITADA',
        folio: 60130,
        fechaEmision: '2025-08-12T00:00:00',
        fechaRecepcion: '2025-08-12T16:28:48',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 13962,
        montoIvaRecuperable: 2653,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 18289,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '1674',
        tasaOtroImpuesto: '0',
        codigoOtroImpuesto: 28,
        estado: 'Confirmada',
        fechaAcuse: null,
        otrosImpuestos: [
          {
            valor: '1674',
            tasa: '0',
            codigo: 28
          }
        ]
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '76534612-6',
        razonSocial: 'COMERCIAL Y SERVICIOS MURILLO LIMITADA',
        folio: 521711,
        fechaEmision: '2025-08-27T00:00:00',
        fechaRecepcion: '2025-08-27T14:31:08',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 28627,
        montoIvaRecuperable: 5439,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 40000,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '5934',
        tasaOtroImpuesto: '0',
        codigoOtroImpuesto: 28,
        estado: 'Confirmada',
        fechaAcuse: null,
        otrosImpuestos: [
          {
            valor: '5934',
            tasa: '0',
            codigo: 28
          }
        ]
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '81201000-K',
        razonSocial: 'CENCOSUD RETAIL S.A.',
        folio: 25041961,
        fechaEmision: '2025-08-30T00:00:00',
        fechaRecepcion: '2025-08-30T16:02:51',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 35085,
        montoIvaRecuperable: 6667,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 44952,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '1100',
        tasaOtroImpuesto: '10',
        codigoOtroImpuesto: 27,
        estado: 'Confirmada',
        fechaAcuse: null,
        otrosImpuestos: [
          {
            valor: '1100',
            tasa: '10',
            codigo: 27
          },
          {
            valor: '2100',
            tasa: '18',
            codigo: 271
          }
        ]
      },
      {
        tipoDTEString: 'FACTURA ELECTRÓNICA',
        tipoDTE: 33,
        tipoCompra: 'Del Giro',
        rutProveedor: '77029043-0',
        razonSocial: 'Distribuidora y Comercializadora SALDAÑA ANDRADE Ltda',
        folio: 47959,
        fechaEmision: '2025-08-30T00:00:00',
        fechaRecepcion: '2025-08-30T18:40:17',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 0,
        montoNeto: 70588,
        montoIvaRecuperable: 13412,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 84000,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA NO AFECTA O EXENTA ELECTRÓNICA',
        tipoDTE: 34,
        tipoCompra: 'Del Giro',
        rutProveedor: '77266631-4',
        razonSocial: 'PROGARANTIA S.A.G.R.',
        folio: 106668,
        fechaEmision: '2025-08-27T00:00:00',
        fechaRecepcion: '2025-08-28T16:23:24',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 3746873,
        montoNeto: 0,
        montoIvaRecuperable: 0,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 3746873,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      },
      {
        tipoDTEString: 'FACTURA NO AFECTA O EXENTA ELECTRÓNICA',
        tipoDTE: 34,
        tipoCompra: 'Del Giro',
        rutProveedor: '77266631-4',
        razonSocial: 'PROGARANTIA S.A.G.R.',
        folio: 106669,
        fechaEmision: '2025-08-27T00:00:00',
        fechaRecepcion: '2025-08-28T16:23:32',
        acuseRecibo: 'No reclamado en plazo',
        montoExento: 76989,
        montoNeto: 0,
        montoIvaRecuperable: 0,
        montoIvaNoRecuperable: 0,
        codigoIvaNoRecuperable: 0,
        montoTotal: 76989,
        montoNetoActivoFijo: 0,
        ivaActivoFijo: 0,
        ivaUsoComun: 0,
        impuestoSinDerechoCredito: 0,
        ivaNoRetenido: 0,
        tabacosPuros: 0,
        tabacosCigarrillos: 0,
        tabacosElaborados: 0,
        nceNdeFacturaCompra: 0,
        valorOtroImpuesto: '',
        tasaOtroImpuesto: '',
        codigoOtroImpuesto: 0,
        estado: 'Confirmada',
        fechaAcuse: null
      }
    ]
  },
  ventas: {
    resumenes: [],
    detalleVentas: []
  }
};

export async function fetchSIIData(month: string | number, year: string | number): Promise<FormResponse> {
  console.log(`fetchSIIData called for ${month}/${year}`);
  
  const requestBody: FormRequest = {
    RutUsuario: '77147627-9',
    PasswordSII: process.env.SII_PASSWORD || '',
    RutEmpresa: '77147627-9',
    Ambiente: 1,
  };

  console.log(`Request body prepared - Password set: ${requestBody.PasswordSII ? '✅' : '❌'}`);
  console.log(`API_KEY set: ${process.env.API_KEY ? '✅' : '❌'}`);

  // If USE_MOCK=true, use the in-file mock response for testing
  if (process.env.USE_MOCK === 'true') {
    console.log('Using MOCK_RESPONSE for fetchSIIData');
    await storeSIIDataInDatabase(MOCK_RESPONSE);
    return MOCK_RESPONSE;
  }

  try {
    console.log(`Making API call to simpleapi.cl for ${month}/${year}`);
    const response = await api.post<FormResponse>(
      `/api/RCV/compras/${month}/${year}`,
      requestBody,
      {
        headers: {
          Authorization: process.env.API_KEY || '',
        },
      }
    );
    
    console.log(`API call successful, status: ${response.status}`);
    console.log(`Response data keys: ${Object.keys(response.data)}`);

    // Store the response data in the database
    console.log(`Storing data in database...`);
    await storeSIIDataInDatabase(response.data);
    console.log(`Data stored successfully`);

    return response.data;
  } catch (error: any) {
    console.error('Error in fetchSIIData:', error);
    if (error.response) {
      console.error('Response error status:', error.response.status);
      console.error('Response error data:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Setup error:', error.message);
    }
    throw error;
  }
}

async function storeSIIDataInDatabase(data: FormResponse): Promise<void> {
  console.log(`Starting database storage for period ${data.caratula.periodo}`);
  const transaction: Transaction = await sequelize.transaction();
  
  try {
    const { caratula, compras } = data;
    
    console.log(`Processing data: ${compras.resumenes.length} resumenes, ${compras.detalleCompras.length} detalles`);
    
    // 1. Ensure empresa exists
    console.log(`Processing empresa: ${caratula.rutEmpresa}`);
    await Empresa.findOrCreate({
      where: { rutEmpresa: caratula.rutEmpresa },
      defaults: {
        rutEmpresa: caratula.rutEmpresa,
        nombreEmpresa: `Empresa ${caratula.rutEmpresa}` // Default name if not provided
      },
      transaction
    });

    // 2. Create or update periodo
    let periodo: any;
    let _created = false;
    
    try {
      [periodo, _created] = await Periodo.findOrCreate({
        where: {
          rutEmpresa: caratula.rutEmpresa,
          periodo: caratula.periodo
        },
        defaults: {
          rutEmpresa: caratula.rutEmpresa,
          periodo: caratula.periodo,
          anio: caratula.anio,
          mes: caratula.mes,
          nombreMes: caratula.nombreMes,
          dia: caratula.dia
        },
        transaction
      });
    } catch (error) {
      console.error('Error in findOrCreate periodo:', error);
      // If findOrCreate fails, try to find existing or create new
      periodo = await Periodo.findOne({
        where: {
          rutEmpresa: caratula.rutEmpresa,
          periodo: caratula.periodo
        },
        transaction
      });
      
      if (!periodo) {
        periodo = await Periodo.create({
          rutEmpresa: caratula.rutEmpresa,
          periodo: caratula.periodo,
          anio: caratula.anio,
          mes: caratula.mes,
          nombreMes: caratula.nombreMes,
          dia: caratula.dia
        }, { transaction });
        _created = true;
      }
    }

    // Get the periodo ID, handling different ways Sequelize might return it
    const periodoId = periodo?.periodoId || periodo?.dataValues?.periodo_id || periodo?.get?.('periodoId');
    
    // Periodo created or found successfully

    // Ensure we have a valid periodo ID
    if (!periodo || !periodoId) {
      throw new Error(`Failed to create or find periodo for ${caratula.periodo}. Periodo ID: ${periodoId}, Periodo object: ${JSON.stringify(periodo)}`);
    }
    
    // Use the extracted periodoId for the rest of the operations
    const finalPeriodoId = periodoId;

    // 3. Process tipo DTEs from resumenes and detalles
    const tipoDteIds = new Set([
      ...compras.resumenes.map(r => r.tipoDte),
      ...compras.detalleCompras.map(d => d.tipoDTE)
    ]);

    for (const tipoDteId of tipoDteIds) {
      const tipoDteString = compras.resumenes.find(r => r.tipoDte === tipoDteId)?.tipoDteString ||
                           compras.detalleCompras.find(d => d.tipoDTE === tipoDteId)?.tipoDTEString ||
                           `Tipo ${tipoDteId}`;
      
      await TipoDte.findOrCreate({
        where: { tipoDte: tipoDteId },
        defaults: {
          tipoDte: tipoDteId,
          descripcion: tipoDteString,
          categoria: tipoDteId >= 30 && tipoDteId <= 34 ? 'factura' : 'otros'
        },
        transaction
      });
    }

    // 4. Process proveedores from detalleCompras
    const proveedores = new Set(compras.detalleCompras.map(d => d.rutProveedor));
    for (const rutProveedor of proveedores) {
      const razonSocial = compras.detalleCompras.find(d => d.rutProveedor === rutProveedor)?.razonSocial;
      
      await Proveedor.findOrCreate({
        where: { rutProveedor },
        defaults: {
          rutProveedor,
          razonSocial: razonSocial || `Proveedor ${rutProveedor}`
        },
        transaction
      });
    }

    // 5. Clear existing resumenes for this period to avoid duplicates
    await ResumenCompras.destroy({
      where: { periodoId: finalPeriodoId },
      transaction
    });

    // 6. Insert resumenes de compras
    for (const resumen of compras.resumenes) {
      await ResumenCompras.create({
        periodoId: finalPeriodoId,
        tipoDte: resumen.tipoDte,
        totalDocumentos: resumen.totalDocumentos,
        montoExento: resumen.montoExento.toString(),
        montoNeto: resumen.montoNeto.toString(),
        ivaRecuperable: resumen.ivaRecuperable.toString(),
        ivaUsoComun: resumen.ivaUsoComun.toString(),
        ivaNoRecuperable: resumen.ivaNoRecuperable.toString(),
        montoTotal: resumen.montoTotal.toString(),
        estado: resumen.estado as 'Confirmada' | 'Pendiente' | 'Rechazada'
      }, { transaction });
    }

    // 7. Track new records for notifications
    const newRecords: any[] = [];

    // Smart upsert for detalle de compras - only update changed records
    for (const detalle of compras.detalleCompras) {
      const folioString = detalle.folio.toString();
      
      // Try to find existing record
      const existingDetalle = await DetalleCompras.findOne({
        where: { 
          folio: folioString,
          periodoId: finalPeriodoId 
        },
        transaction
      });

      const detalleData = {
        periodoId: finalPeriodoId,
        tipoDte: detalle.tipoDTE,
        tipoCompra: detalle.tipoCompra,
        rutProveedor: detalle.rutProveedor,
        folio: folioString,
        fechaEmision: new Date(detalle.fechaEmision),
        fechaRecepcion: new Date(detalle.fechaRecepcion),
        acuseRecibo: detalle.acuseRecibo,
        fechaAcuse: detalle.fechaAcuse ? new Date(detalle.fechaAcuse) : null,
        montoExento: detalle.montoExento.toString(),
        montoNeto: detalle.montoNeto.toString(),
        montoIvaRecuperable: detalle.montoIvaRecuperable.toString(),
        montoIvaNoRecuperable: detalle.montoIvaNoRecuperable.toString(),
        codigoIvaNoRecuperable: detalle.codigoIvaNoRecuperable,
        montoTotal: detalle.montoTotal.toString(),
        montoNetoActivoFijo: detalle.montoNetoActivoFijo.toString(),
        ivaActivoFijo: detalle.ivaActivoFijo.toString(),
        ivaUsoComun: detalle.ivaUsoComun.toString(),
        impuestoSinDerechoCredito: detalle.impuestoSinDerechoCredito.toString(),
        ivaNoRetenido: detalle.ivaNoRetenido.toString(),
        tabacosPuros: detalle.tabacosPuros?.toString() || null,
        tabacosCigarrillos: detalle.tabacosCigarrillos?.toString() || null,
        tabacosElaborados: detalle.tabacosElaborados?.toString() || null,
        nceNdeFacturaCompra: detalle.nceNdeFacturaCompra.toString(),
        valorOtroImpuesto: detalle.valorOtroImpuesto || null,
        tasaOtroImpuesto: detalle.tasaOtroImpuesto || null,
        codigoOtroImpuesto: detalle.codigoOtroImpuesto || 0,
        estado: detalle.estado as 'Confirmada' | 'Pendiente' | 'Rechazada'
      };

      let detalleCompra;
      
      if (existingDetalle) {
        // Check if any fields have changed
        const hasChanges = Object.entries(detalleData).some(([key, newValue]) => {
          const existingValue = existingDetalle.get(key as keyof typeof existingDetalle);
          // Handle date comparisons
          if (newValue instanceof Date && existingValue instanceof Date) {
            return newValue.getTime() !== existingValue.getTime();
          }
          return String(existingValue) !== String(newValue);
        });

        if (hasChanges) {
          // Update existing record
          await existingDetalle.update(detalleData, { transaction });
          detalleCompra = existingDetalle;
          console.log(`Updated detalle_compras for folio ${folioString}`);
        } else {
          // No changes, use existing record
          detalleCompra = existingDetalle;
        }
      } else {
        // Create new record - THIS IS WHERE WE TRACK NEW RECORDS
        detalleCompra = await DetalleCompras.create(detalleData, { transaction });
        console.log(`Created NEW detalle_compras for folio ${folioString}`);
        
        // Track this as a new record for notification
        newRecords.push({
          folio: folioString,
          rutProveedor: detalle.rutProveedor,
          razonSocial: detalle.razonSocial,
          montoTotal: detalle.montoTotal,
          tipoDTE: detalle.tipoDTE,
          tipoDTEString: detalle.tipoDTEString,
          fechaEmision: detalle.fechaEmision
        });
      }

      // Handle otros impuestos - clear and recreate if they exist
      if (detalle.otrosImpuestos && detalle.otrosImpuestos.length > 0) {
        // Clear existing otros impuestos for this detalle
        await OtrosImpuestos.destroy({
          where: { detalleId: detalleCompra.detalleId },
          transaction
        });
        
        // Insert new otros impuestos
        for (const otroImpuesto of detalle.otrosImpuestos) {
          await OtrosImpuestos.create({
            detalleId: detalleCompra.detalleId,
            valor: otroImpuesto.valor,
            tasa: parseFloat(otroImpuesto.tasa),
            codigo: otroImpuesto.codigo
          }, { transaction });
        }
      } else if (existingDetalle) {
        // Clear otros impuestos if no longer present
        await OtrosImpuestos.destroy({
          where: { detalleId: detalleCompra.detalleId },
          transaction
        });
      }
    }

    // 8. Remove detalle_compras records that no longer exist in the new data
    const newFolios = compras.detalleCompras.map(d => d.folio.toString());
    await DetalleCompras.destroy({
      where: {
        periodoId: finalPeriodoId,
        folio: {
          [Op.notIn]: newFolios
        }
      },
      transaction
    });

    await transaction.commit();
    console.log(`Successfully stored SII data for period ${caratula.periodo}`);
    console.log(`Final summary: ${compras.resumenes.length} resumenes, ${compras.detalleCompras.length} detalles processed`);
    
    // SEND NOTIFICATIONS FOR NEW RECORDS AFTER SUCCESSFUL COMMIT
    if (newRecords.length > 0) {
      console.log(`Sending notifications for ${newRecords.length} new records`);
      
      for (const record of newRecords) {
        const notification: NewRecordNotification = {
          folio: record.folio,
          rutProveedor: record.rutProveedor,
          razonSocial: record.razonSocial,
          montoTotal: record.montoTotal,
          tipoDTE: record.tipoDTE,
          tipoDTEString: record.tipoDTEString,
          fechaEmision: record.fechaEmision,
          timestamp: new Date().toISOString()
        };
        
        notificationService.notifyNewRecord(notification);
      }
    }
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error storing SII data in database:', error);
    console.error('Database error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to store SII data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Separate function to only fetch data without storing
export async function fetchSIIDataOnly(month: string | number, year: string | number): Promise<FormResponse> {
  const requestBody: FormRequest = {
    RutUsuario: '77147627-9',
    PasswordSII: process.env.SII_PASSWORD || '',
    RutEmpresa: '77147627-9',
    Ambiente: 1,
  };

  // If USE_MOCK=true, return the in-file mock response for testing
  if (process.env.USE_MOCK === 'true') {
    console.log('Using MOCK_RESPONSE for fetchSIIDataOnly');
    return MOCK_RESPONSE;
  }

  const response = await api.post<FormResponse>(
    `/api/RCV/compras/${month}/${year}`,
    requestBody,
    {
      headers: {
        Authorization: process.env.API_KEY || '',
      },
    }
  );

  return response.data;
}

// Separate function to store existing SII data
export async function storeSIIData(data: FormResponse): Promise<void> {
  await storeSIIDataInDatabase(data);
}

export default {
  fetchSIIData,
  fetchSIIDataOnly,
  storeSIIData,
};
