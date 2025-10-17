import { Request, Response } from 'express';
import { fetchSIIData, fetchSIIDataOnly, storeSIIData } from '../services/simpleAPIdataFetch.js';

// Fetch and store SII data for a specific month/year 
export const fetchAndStore = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`fetchAndStore called for period: ${req.params.year}/${req.params.month}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Environment check - API_KEY: ${process.env.API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`Environment check - SII_PASSWORD: ${process.env.SII_PASSWORD ? '✅ Set' : '❌ Missing'}`);
    console.log(`Environment check - USE_MOCK: ${process.env.USE_MOCK || 'false'}`);
    
    const { month, year } = req.params;
    
    if (!month || !year) {
      console.log(`Missing parameters - month: ${month}, year: ${year}`);
      res.status(400).json({ 
        error: 'Month and year parameters are required' 
      });
      return;
    }

    console.log(`Calling fetchSIIData for ${month}/${year}`);
    const data = await fetchSIIData(month, year);
    console.log(`fetchSIIData completed successfully`);

    res.status(200).json({
      message: 'SII data fetched and stored successfully',
      caratula: data.caratula,
      summary: {
        totalResumenes: data.compras.resumenes.length,
        totalDetalleCompras: data.compras.detalleCompras.length
      }
    });

  } catch (error) {
    console.error('❌ Error in fetchAndStore:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    res.status(500).json({ 
      error: 'Failed to fetch and store SII data',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
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

// Test endpoint to check environment and connections
export const testEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`🧪 Test endpoint called at ${new Date().toISOString()}`);
    
    // Check environment variables
    const envCheck = {
      API_KEY: process.env.API_KEY ? '✅ Set' : '❌ Missing',
      SII_PASSWORD: process.env.SII_PASSWORD ? '✅ Set' : '❌ Missing',
      USE_MOCK: process.env.USE_MOCK || 'false',
      NODE_ENV: process.env.NODE_ENV || 'development',
      PGDATABASE: process.env.PGDATABASE ? '✅ Set' : '❌ Missing',
      PGUSER: process.env.PGUSER ? '✅ Set' : '❌ Missing',
      PGPASSWORD: process.env.PGPASSWORD ? '✅ Set' : '❌ Missing',
      PGHOST: process.env.PGHOST || 'localhost',
      PGPORT: process.env.PGPORT || '5431'
    };

    // Test database connection
    let dbStatus = 'unknown';
    try {
      const { testConnection } = await import('../config/db.js');
      await testConnection();
      dbStatus = '✅ Connected';
    } catch (dbError) {
      dbStatus = `❌ Failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    }

    res.status(200).json({
      message: 'Test endpoint successful',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      version: '1.0.0'
    });

  } catch (error) {
    console.error('❌ Error in test endpoint:', error);
    res.status(500).json({ 
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Get API call counter information
export const getCallCount = async (req: Request, res: Response): Promise<void> => {
  try {
    
    // Direct SQL query to bypass any ORM issues
    const { sequelize } = await import('../models/index.js');
    const [results] = await sequelize.query(
      'SELECT counter_id, function_name, call_count, last_called_at, created_at, updated_at FROM dte.api_call_counter ORDER BY function_name ASC',
      { raw: true }
    ) as any[];
    
    
    // Find the fetchSIIData counter
    const fetchCounter = results.find((c: any) => c.function_name === 'fetchSIIData');
    const fetchSIIDataCount = fetchCounter ? Number(fetchCounter.call_count) : 0;
    
    
    res.status(200).json({
      message: 'API call counter retrieved successfully',
      fetchSIIDataCount,
      allCounters: results.map((counter: any) => ({
        functionName: counter.function_name,
        callCount: Number(counter.call_count),
        lastCalledAt: counter.last_called_at,
        createdAt: counter.created_at,
        updatedAt: counter.updated_at
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting call count:', error);
    res.status(500).json({ 
      error: 'Failed to get call count',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Reset API call counter
export const resetCounter = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Resetting API call counter');
    
    // Direct SQL query to reset the counter
    const { sequelize } = await import('../models/index.js');
    await sequelize.query(
      "UPDATE dte.api_call_counter SET call_count = 0, updated_at = CURRENT_TIMESTAMP WHERE function_name = 'fetchSIIData'",
      { raw: true }
    );
    
    console.log('✅ API call counter reset successfully');
    
    res.status(200).json({
      message: 'API call counter reset successfully',
      functionName: 'fetchSIIData',
      newCount: 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error resetting call count:', error);
    res.status(500).json({ 
      error: 'Failed to reset call count',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};