import mysql from 'mysql2/promise';

const MAX_RETRIES = 5; // Increased from 3 to 5
const RETRY_DELAY = 5000; // Increased from 2000ms to 5000ms

const createPool = () => mysql.createPool({
  host: process.env.DB_HOST || 'db4free.net',
  user: process.env.DB_USER || 'bhoot_top',
  password: process.env.DB_PASSWORD || 'Samrat726728',
  database: process.env.DB_NAME || 'bhoot_top',
  waitForConnections: true,
  connectionLimit: 3, // Reduced from 5 to 3 to prevent overwhelming the free tier
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '120000'), // Increased from 60000 to 120000
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
  // Added additional connection configurations for better stability
  acquireTimeout: 30000,
  timezone: 'Z',
  dateStrings: true
});

let pool: any = null;

// Initialize pool with retry mechanism
async function initializePool(retries = MAX_RETRIES): Promise<any> {
  try {
    if (!pool) {
      pool = createPool();
    }
    return pool;
  } catch (error) {
    console.error('Failed to initialize connection pool:', error);
    if (retries > 0) {
      console.log(`Retrying pool initialization in ${RETRY_DELAY}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializePool(retries - 1);
    }
    throw error;
  }
}

async function queryWithRetry(sql: string, params: any[] = [], retries = MAX_RETRIES): Promise<any> {
  try {
    // Ensure pool is initialized
    const currentPool = await initializePool();
    const [results] = await currentPool.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      sql: error.sql,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      remainingRetries: retries,
      stack: error.stack // Added stack trace for better debugging
    });

    // Handle various error types
    if (retries > 0 && (
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'PROTOCOL_CONNECTION_LOST' ||
      error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'
    )) {
      console.log(`Retrying query in ${RETRY_DELAY}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      // Reset pool on connection errors
      if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        pool = null;
      }
      
      return queryWithRetry(sql, params, retries - 1);
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error('Database connection timed out. The database server might be experiencing high load or connectivity issues. Please try again later.');
    }
    throw error;
  }
}

// Enhanced connection test with detailed error reporting
async function testConnection(retries = MAX_RETRIES) {
  try {
    const currentPool = await initializePool();
    const connection = await currentPool.getConnection();
    
    // Test the connection with a simple query
    await connection.query('SELECT 1');
    console.log('Database connection established and verified successfully');
    connection.release();
  } catch (err: any) {
    console.error('Failed to establish database connection:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    
    if (retries > 0) {
      console.log(`Retrying connection in ${RETRY_DELAY}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      await testConnection(retries - 1);
    } else {
      console.error('Maximum connection retries exceeded. Please check database configuration and connectivity.');
    }
  }
}

// Initialize connection on startup
testConnection();

export { queryWithRetry as query };
export default pool;