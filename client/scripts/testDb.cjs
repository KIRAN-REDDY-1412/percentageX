const { Client } = require('pg');

async function testDirect() {
  console.log('Testing direct connection...');
  const client = new Client({
    connectionString: 'postgresql://postgres:8cre5oKFHgmkXFSH@db.dafetilwfgfbmvlwgahc.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Successfully connected to direct Supabase PostgreSQL!');
    const res = await client.query('SELECT current_database(), current_schema()');
    console.log('Database info:', res.rows[0]);
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Public tables:', tables.rows.map(r => r.table_name));
    await client.end();
    return true;
  } catch (err) {
    console.error('Direct connection failed:', err.message);
    return false;
  }
}

async function testPooler() {
  console.log('Testing pooler connection...');
  const client = new Client({
    connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Successfully connected to Supabase Pooler!');
    const res = await client.query('SELECT current_database()');
    console.log('Database info:', res.rows[0]);
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Public tables:', tables.rows.map(r => r.table_name));
    await client.end();
    return true;
  } catch (err) {
    console.error('Pooler connection failed:', err.message);
    return false;
  }
}

async function main() {
  const directOk = await testDirect();
  if (!directOk) {
    await testPooler();
  }
}

main();
