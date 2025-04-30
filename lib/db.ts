import mysql from 'mysql2/promise';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const createPool = () => mysql.createPool({
  host: process.env.DB_HOST || 'db4free.net',
  user: process.env.DB_USER || 'bhoot_top',
  password: process.env.DB_PASSWORD || 'Samrat726728',
  database: process.env.DB_NAME || 'bhoot_top',
  waitForConnections: true,
  connectionLimit: 5, // Reduced from 10 to prevent overwhelming the free tier
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
});

const pool = createPool();

async function queryWithRetry(sql: string, params: any[] = [], retries = MAX_RETRIES): Promise<any> {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      sql: error.sql,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      remainingRetries: retries
    });

    if (retries > 0 && (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED')) {
      console.log(`Retrying query in ${RETRY_DELAY}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return queryWithRetry(sql, params, retries - 1);
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error('Database connection timed out. Please try again later.');
    }
    throw error;
  }
}

// Test connection on startup with retry logic
async function testConnection(retries = MAX_RETRIES) {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
  } catch (err) {
    console.error('Failed to establish database connection:', err);
    if (retries > 0) {
      console.log(`Retrying connection in ${RETRY_DELAY}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      await testConnection(retries - 1);
    }
  }
}

testConnection();

export { queryWithRetry as query };
export default pool;