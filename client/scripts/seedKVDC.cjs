const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

async function seedKVDC() {
  console.log('Seeding KVDC into Supabase database...');
  const colId = 'col-kvdc-01';
  
  // 1. Insert or update college
  await pool.query(`
    INSERT INTO colleges (id, name, code, college_type, address, phone, email, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      code = EXCLUDED.code,
      college_type = EXCLUDED.college_type,
      address = EXCLUDED.address,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      status = EXCLUDED.status;
  `, [
    colId,
    'Krishna Veni Degree College',
    'KVDC',
    'DEGREE',
    'CPT Road, Narasaraopet',
    '+91 98888 12345',
    'admin@kvdc.edu',
    'active',
  ]);

  // 2. Insert admin user
  await pool.query(`
    INSERT INTO users (id, college_id, email, password_hash, name, role, designation, phone)
    VALUES ($1, $2, $3, $4, $5, 'admin', 'College Administrator', $6)
    ON CONFLICT (email) DO UPDATE SET
      college_id = EXCLUDED.college_id,
      name = EXCLUDED.name,
      role = 'admin',
      password_hash = EXCLUDED.password_hash;
  `, [
    'usr-adm-kvdc-01',
    colId,
    'admin@kvdc.edu',
    'password123',
    'Krishna Veni Admin',
    '+91 98888 12345',
  ]);

  console.log('✓ Successfully seeded KVDC and admin@kvdc.edu into Supabase!');
  
  const cols = await pool.query('SELECT * FROM colleges');
  console.log('Current colleges in Supabase:', cols.rows);

  const users = await pool.query('SELECT id, name, email, role, college_id FROM users');
  console.log('Current users in Supabase:', users.rows);

  await pool.end();
}

seedKVDC().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
