import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Get the directory path for reading mock files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create axios instance
const api = axios.create({
  baseURL: 'https://servicios.simpleapi.cl',
  timeout: 300000, // 5 minutes for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to load mock response from colegio.txt file
function loadMockResponse(): FormResponse {
  try {
    const mockFilePath = path.join(__dirname, '../mock_responses/colegio.txt');
    const fileContent = fs.readFileSync(mockFilePath, 'utf-8');
    return JSON.parse(fileContent) as FormResponse;
  } catch (error) {
    console.error('Error loading mock response from colegio.txt:', error);
    // Fallback to a simple mock response if file can't be read
    return {
      caratula: {
        rutEmpresa: '65145564-2',
        nombreMes: 'Octubre',
        mes: 10,
        anio: 2025,
        dia: null,
        periodo: '202510'
      },
      compras: {
        resumenes: [],
        detalleCompras: []
      },
      ventas: {
        resumenes: [],
        detalleVentas: []
      }
    };
  }
}

export async function fetchSIIData(month: string | number, year: string | number): Promise<FormResponse> {
  console.log(`fetchSIIData called for ${month}/${year}`);
  
  const requestBody: FormRequest = {
    RutUsuario: '65145564-2',
    PasswordSII: process.env.SII_PASSWORD || '',
    RutEmpresa: '65145564-2',
    Ambiente: 1,
  };

  console.log(`Request body prepared - Password set: ${requestBody.PasswordSII ? '✅' : '❌'}`);
  console.log(`API_KEY set: ${process.env.API_KEY ? '✅' : '❌'}`);

  // If USE_MOCK=true, use the mock response from colegio.txt for testing
  if (process.env.USE_MOCK === 'true') {
    console.log('Using mock response from colegio.txt for fetchSIIData');
    const mockResponse = loadMockResponse();
    await storeSIIDataInDatabase(mockResponse);
    return mockResponse;
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
      
      // Search using the proper compound constraint: rut_proveedor, folio, tipo_dte
      const existingDetalle = await DetalleCompras.findOne({
        where: { 
          rutProveedor: detalle.rutProveedor,
          folio: folioString,
          tipoDte: detalle.tipoDTE
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
      // Only process if we have a valid detalleCompra record
      if (detalleCompra && detalle.otrosImpuestos && detalle.otrosImpuestos.length > 0) {
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
      } else if (detalleCompra && existingDetalle) {
        // Clear otros impuestos if no longer present
        await OtrosImpuestos.destroy({
          where: { detalleId: detalleCompra.detalleId },
          transaction
        });
      }
    }

    // 8. Remove detalle_compras records that no longer exist in the new data for this period
    // We need to be careful here because folios are globally unique, but we only want to remove
    // records from this specific period
    const existingFoliosForPeriod = await DetalleCompras.findAll({
      where: { periodoId: finalPeriodoId },
      attributes: ['folio'],
      transaction
    });
    
    const existingFoliosArray = existingFoliosForPeriod.map(d => d.folio);
    const newFolios = compras.detalleCompras.map(d => d.folio.toString());
    const foliosToRemove = existingFoliosArray.filter(folio => !newFolios.includes(folio));
    
    if (foliosToRemove.length > 0) {
      await DetalleCompras.destroy({
        where: {
          periodoId: finalPeriodoId,
          folio: {
            [Op.in]: foliosToRemove
          }
        },
        transaction
      });
    }

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
    RutUsuario: '65145564-2',
    PasswordSII: process.env.SII_PASSWORD || '',
    RutEmpresa: '65145564-2',
    Ambiente: 1,
  };

  // If USE_MOCK=true, return the mock response from colegio.txt for testing
  if (process.env.USE_MOCK === 'true') {
    console.log('Using mock response from colegio.txt for fetchSIIDataOnly');
    return loadMockResponse();
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
