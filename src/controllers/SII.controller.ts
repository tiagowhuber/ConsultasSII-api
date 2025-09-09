import { Request, Response } from 'express';
import { fetchSIIData, fetchSIIDataOnly, storeSIIData } from '../services/simpleAPIdataFetch.js';

// Fetch and store SII data for a specific month/year
export const fetchAndStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.params;
    
    if (!month || !year) {
      res.status(400).json({ 
        error: 'Month and year parameters are required' 
      });
      return;
    }

    const data = await fetchSIIData(month, year);
    
    res.status(200).json({
      message: 'SII data fetched and stored successfully',
      caratula: data.caratula,
      summary: {
        totalResumenes: data.compras.resumenes.length,
        totalDetalleCompras: data.compras.detalleCompras.length
      }
    });

  } catch (error) {
    console.error('Error in fetchAndStore:', error);
    res.status(500).json({ 
      error: 'Failed to fetch and store SII data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Fetch SII data without storing (for preview/testing)
export const fetchOnly = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.params;
    
    if (!month || !year) {
      res.status(400).json({ 
        error: 'Month and year parameters are required' 
      });
      return;
    }

    const data = await fetchSIIDataOnly(month, year);
    
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in fetchOnly:', error);
    res.status(500).json({ 
      error: 'Failed to fetch SII data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Store existing SII data (for manual imports)
export const storeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const siiData = req.body;
    
    if (!siiData || !siiData.caratula || !siiData.compras) {
      res.status(400).json({ 
        error: 'Invalid SII data format' 
      });
      return;
    }

    await storeSIIData(siiData);
    
    res.status(200).json({
      message: 'SII data stored successfully',
      periodo: siiData.caratula.periodo
    });

  } catch (error) {
    console.error('Error in storeData:', error);
    res.status(500).json({ 
      error: 'Failed to store SII data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};