const { Client } = require('pg');

async function inspect() {
  const client = new Client({
    connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth'");
  console.log('Auth tables:', tables.rows.map(r => r.table_name));

  // Check if any secrets or config tables exist in pg_catalog or supabase internal
  const allTables = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name LIKE '%secret%' OR table_name LIKE '%config%' OR table_name LIKE '%jwt%'");
  console.log('Config/Secret tables:', allTables.rows);

  // Check pg_proc or functions for jwt secret
  const funcs = await client.query("SELECT proname FROM pg_proc WHERE proname LIKE '%jwt%' OR proname LIKE '%anon%'");
  console.log('JWT/Anon functions:', funcs.rows.map(r => r.proname));

  await client.end();
}

inspect().catch(console.error);
