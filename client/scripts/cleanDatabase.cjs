const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

async function cleanDatabase() {
  console.log('--- CLEANING DATABASE FOR DEPLOYMENT ---');

  // Truncate dependent tables
  await pool.query('TRUNCATE TABLE attendance_sessions CASCADE;');
  console.log('✓ Cleared attendance_sessions');

  await pool.query('TRUNCATE TABLE internal_marks CASCADE;');
  console.log('✓ Cleared internal_marks');

  await pool.query('TRUNCATE TABLE assignments CASCADE;');
  console.log('✓ Cleared assignments');

  await pool.query('TRUNCATE TABLE timetable_assignments CASCADE;');
  console.log('✓ Cleared timetable_assignments');

  await pool.query('TRUNCATE TABLE students CASCADE;');
  console.log('✓ Cleared students');

  await pool.query('TRUNCATE TABLE sections CASCADE;');
  console.log('✓ Cleared sections');

  await pool.query('TRUNCATE TABLE subjects CASCADE;');
  console.log('✓ Cleared subjects');

  await pool.query('TRUNCATE TABLE courses CASCADE;');
  console.log('✓ Cleared courses');

  await pool.query('TRUNCATE TABLE departments CASCADE;');
  console.log('✓ Cleared departments');

  // Remove non-superadmin users
  await pool.query("DELETE FROM users WHERE role != 'super_admin';");
  console.log('✓ Removed test staff & faculty accounts');

  // Truncate colleges
  await pool.query('TRUNCATE TABLE colleges CASCADE;');
  console.log('✓ Cleared colleges');

  // Ensure root Super Admin user exists
  await pool.query(`
    INSERT INTO users (id, name, email, password_hash, role, college_id, department, designation)
    VALUES (
      'usr-superadmin',
      'Platform Super Admin',
      'superadmin@percentagex.edu',
      'password123',
      'super_admin',
      NULL,
      'Platform Governance',
      'Super Administrator'
    )
    ON CONFLICT (email) DO UPDATE SET
      name = 'Platform Super Admin',
      role = 'super_admin',
      college_id = NULL,
      password_hash = 'password123';
  `);
  console.log('✓ Seeded root Super Admin: superadmin@percentagex.edu / password123');

  // Verify database state
  const colCount = await pool.query('SELECT count(*) FROM colleges');
  const userCount = await pool.query('SELECT count(*) FROM users');
  const studentCount = await pool.query('SELECT count(*) FROM students');

  console.log('\n--- VERIFICATION ---');
  console.log('Colleges count:', colCount.rows[0].count);
  console.log('Users count:', userCount.rows[0].count);
  console.log('Students count:', studentCount.rows[0].count);

  await pool.end();
}

cleanDatabase().catch(err => {
  console.error('Database cleanup error:', err);
  process.exit(1);
});
