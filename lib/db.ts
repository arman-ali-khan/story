import mysql from 'mysql2/promise';

const MAX_RETRIES = 7;
const INITIAL_RETRY_DELAY = 3000;

const createPool = () => mysql.createPool({
  host: process.env.DB_HOST || 'db4free.net',
  user: process.env.DB_USER || 'bhoot_top',
  password: process.env.DB_PASSWORD || 'Samrat726728',
  database: process.env.DB_NAME || 'bhoot_top',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 5,
  connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '300000'),
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  multipleStatements: true,
  maxIdle: 1,
  idleTimeout: 60000
});

const pool = createPool();

async function queryWithRetry(sql: string, params: any[] = [], retries = MAX_RETRIES): Promise<any> {
  try {
    console.log('Executing database query...');
    const [results] = await pool.execute(sql, params);
    console.log('Query executed successfully');
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

    const retryableErrors = ['ETIMEDOUT', 'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ECONNRESET'];
    
    if (retries > 0 && retryableErrors.includes(error.code)) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      const maxDelay = 30000;
      const actualDelay = Math.min(delay, maxDelay);
      
      console.log(`Retrying query in ${actualDelay}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, actualDelay));
      return queryWithRetry(sql, params, retries - 1);
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error('Database connection timed out. Please try again later.');
    }
    throw error;
  }
}

async function testConnection(retries = MAX_RETRIES) {
  try {
    console.log('Establishing database connection...');
    const connection = await pool.getConnection();
    console.log('✓ Database connection established successfully');
    connection.release();
  } catch (err) {
    console.error('Failed to establish database connection:', err);
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      const maxDelay = 30000;
      const actualDelay = Math.min(delay, maxDelay);
      
      console.log(`Retrying connection in ${actualDelay}ms... (${retries} retries remaining)`);
      await new Promise(resolve => setTimeout(resolve, actualDelay));
      await testConnection(retries - 1);
    }
  }
}

testConnection();

export { queryWithRetry as query };
export default pool;