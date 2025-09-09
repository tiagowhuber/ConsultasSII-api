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
import { Transaction } from 'sequelize';

// Create axios instance
const api = axios.create({
  baseURL: 'https://servicios.simpleapi.cl',
  timeout: 300000, // 5 minutes for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchSIIData(month: string | number, year: string | number): Promise<FormResponse> {
  const requestBody: FormRequest = {
    RutUsuario: '77147627-9',
    PasswordSII: process.env.SII_PASSWORD || '',
    RutEmpresa: '77147627-9',
    Ambiente: 1,
  };

  const response = await api.post<FormResponse>(
    `/api/RCV/compras/${month}/${year}`,
    requestBody,
    {
      headers: {
        Authorization: process.env.API_KEY || '',
      },
    }
  );

  // Store the response data in the database
  await storeSIIDataInDatabase(response.data);

  return response.data;
}

async function storeSIIDataInDatabase(data: FormResponse): Promise<void> {
  const transaction: Transaction = await sequelize.transaction();
  
  try {
    const { caratula, compras } = data;
    
    // 1. Ensure empresa exists
    await Empresa.findOrCreate({
      where: { rutEmpresa: caratula.rutEmpresa },
      defaults: {
        rutEmpresa: caratula.rutEmpresa,
        nombreEmpresa: `Empresa ${caratula.rutEmpresa}` // Default name if not provided
      },
      transaction
    });

    // 2. Create or update periodo
    const [periodo] = await Periodo.findOrCreate({
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
      where: { periodoId: periodo.periodoId },
      transaction
    });

    // 6. Insert resumenes de compras
    for (const resumen of compras.resumenes) {
      await ResumenCompras.create({
        periodoId: periodo.periodoId,
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

    // 7. Clear existing detalles for this period to avoid duplicates
    await DetalleCompras.destroy({
      where: { periodoId: periodo.periodoId },
      transaction
    });

    // 8. Insert detalle de compras
    for (const detalle of compras.detalleCompras) {
      const detalleCompra = await DetalleCompras.create({
        periodoId: periodo.periodoId,
        tipoDte: detalle.tipoDTE,
        tipoCompra: detalle.tipoCompra,
        rutProveedor: detalle.rutProveedor,
        folio: detalle.folio.toString(),
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
      }, { transaction });

      // 9. Insert otros impuestos if they exist
      if (detalle.otrosImpuestos && detalle.otrosImpuestos.length > 0) {
        for (const otroImpuesto of detalle.otrosImpuestos) {
          await OtrosImpuestos.create({
            detalleId: detalleCompra.detalleId,
            valor: otroImpuesto.valor,
            tasa: parseFloat(otroImpuesto.tasa),
            codigo: otroImpuesto.codigo
          }, { transaction });
        }
      }
    }

    await transaction.commit();
    console.log(`Successfully stored SII data for period ${caratula.periodo}`);
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error storing SII data in database:', error);
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
