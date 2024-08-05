import pg from "pg";
const { Pool } = pg;

let pool;

const getPool = () => {
  if (pool) return pool;

  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "sachin",
    password: process.env.DB_PASSWORD || "root123",
    database: process.env.DB_DATABASE || "contri",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // ssl: {
    //   mode: "require",
    // },
  });

  pool = pool;
  return pool;
};

const getClient = async () => {
  return await getPool().connect();
};

export { getPool, getClient };
