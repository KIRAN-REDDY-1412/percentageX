const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('Updating Super Admin credentials in database...');
  const res = await pool.query(
    `UPDATE users 
     SET email = $1, password_hash = $2 
     WHERE role = 'super_admin' OR id = 'usr-superadmin' 
     RETURNING id, name, email, password_hash, role`,
    ['kiranreddy0509@gmail.com', 'kiran@1006']
  );

  if (res.rows.length === 0) {
    console.log('No existing superadmin found, inserting fresh...');
    const insertRes = await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, designation, department)
       VALUES ('usr-superadmin', 'Platform Super Admin', $1, $2, 'super_admin', 'Super Administrator', 'Platform Governance')
       RETURNING id, name, email, password_hash, role`,
      ['kiranreddy0509@gmail.com', 'kiran@1006']
    );
    console.log('Inserted:', insertRes.rows);
  } else {
    console.log('Updated:', res.rows);
  }

  await pool.end();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
