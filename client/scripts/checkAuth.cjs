const { Client } = require('pg');

async function checkAuth() {
  const client = new Client({
    connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const instances = await client.query("SELECT * FROM auth.instances");
  console.log('Instances:', instances.rows);

  const logs = await client.query("SELECT * FROM auth.audit_log_entries LIMIT 5");
  console.log('Logs:', logs.rows);

  await client.end();
}

checkAuth().catch(console.error);
