import { Request, Response } from 'express';
import axios from 'axios';

// api.simpleapi.cl uses JSON (different from servicios.simpleapi.cl which uses multipart)
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

  if (!certPath) {
    res.status(503).json({
      error: 'Certificado digital no configurado.',
      fallback: true,
    });
    return;
  }

  // TODO: api.simpleapi.cl/api/v1/Consulta/dte/info returns 500 with no body.
  // Awaiting updated documentation from SimpleAPI for this endpoint.
  // Until then, respond with fallback so the frontend uses its own PDF renderer.
  res.status(503).json({
    error: 'PDF oficial no disponible temporalmente.',
    fallback: true,
  });
};
