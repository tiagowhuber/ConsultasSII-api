import { Request, Response } from 'express';
import axios from 'axios';

const simpleApiClient = axios.create({
  baseURL: 'https://api.simpleapi.cl',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * POST /api/dte/pdf-oficial
 *
 * Two-step flow:
 *  1. Call SimpleAPI /Consulta/dte/info to retrieve the full DTE from SII
 *  2. Call SimpleAPI /Impresion/{tipo}/Carta/2 to render the official PDF
 *
 * Returns the PDF bytes as application/pdf, or falls back with a 503 when
 * the digital certificate is not yet configured.
 */
export const getOfficialPdf = async (req: Request, res: Response): Promise<void> => {
  const certPath = process.env.PFX_PATH;
  const certPassword = process.env.PFX_PASSWORD ?? '';
  const pfxRut = process.env.PFX_RUT || process.env.SII_RUT || '';
  const siiRut = process.env.SII_RUT ?? '65145564-2';
  const siiPassword = process.env.PFX_PASSWORD ?? '';
  const apiKey = process.env.API_KEY ?? '';

  if (!certPath) {
    res.status(503).json({
      error: 'Certificado digital no configurado.',
      fallback: true,
    });
    return;
  }

  const { folio, tipoDte, fechaEmision, montoTotal, rutReceptor } = req.body as {
    folio: number;
    tipoDte: number;
    fechaEmision: string;
    montoTotal: number;
    rutEmisor: string;
    rutReceptor: string;
  };

  if (!folio || !tipoDte || !fechaEmision || montoTotal === undefined || !rutReceptor) {
    res.status(400).json({ error: 'Faltan campos requeridos.' });
    return;
  }

  const authHeaders = { Authorization: apiKey };

  try {
    // Step 1: Query full DTE data from SII via SimpleAPI
    const consultaBody = {
      certificado: {
        ruta: certPath,
        password: certPassword,
        rut: pfxRut,
      },
      fechaDTE: new Date(fechaEmision).toISOString(),
      total: montoTotal,
      folio: Number(folio),
      tipo: Number(tipoDte),
      rutEmpresa: rutReceptor,
      rutReceptor: rutReceptor,
      autenticacion: {
        rut: siiRut,
        password: siiPassword,
      },
      ambiente: 1,
    };

    const consultaResponse = await simpleApiClient.post(
      '/api/v1/Consulta/dte/info',
      consultaBody,
      { headers: authHeaders },
    );
    const dteData = consultaResponse.data;

    // Step 2: Render official SII-format PDF via SimpleAPI
    const pdfBody = {
      dte: dteData,
    };

    const pdfResponse = await simpleApiClient.post(
      `/api/v1/Impresion/${tipoDte}/Carta/2`,
      pdfBody,
      {
        headers: authHeaders,
        responseType: 'arraybuffer',
      },
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="DTE_${tipoDte}_${rutReceptor}_${folio}.pdf"`,
    );
    res.send(Buffer.from(pdfResponse.data as ArrayBuffer));
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number }; message?: string };
    console.error('Error fetching official PDF:', axiosError.message);

    const status = axiosError.response?.status;
    if (status === 401) {
      res.status(503).json({ error: 'Error de autenticación con SimpleAPI.', fallback: true });
    } else if (status === 404) {
      res.status(404).json({ error: 'DTE no encontrado en SII.', fallback: true });
    } else {
      res.status(503).json({
        error: 'Error al generar PDF oficial.',
        detail: axiosError.message,
        fallback: true,
      });
    }
  }
};
