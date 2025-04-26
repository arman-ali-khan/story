import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql.freedb.tech',
  user: 'freedb_samrat',
  password: 'qKR6mRj5Hp&3WS#',
  database: 'freedb_chating_secure',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;