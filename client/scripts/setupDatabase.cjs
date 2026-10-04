const { Client } = require('pg');

const poolerUrl = 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function setup() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: poolerUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected! Creating schema...');

  const schemaSql = `
    -- Enable uuid extension if available
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- 1. Colleges
    CREATE TABLE IF NOT EXISTS colleges (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      college_type VARCHAR(50) NOT NULL CHECK (college_type IN ('BTECH', 'DEGREE', 'JUNIOR_COLLEGE')),
      address TEXT,
      phone VARCHAR(50),
      email VARCHAR(100),
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 2. Departments
    CREATE TABLE IF NOT EXISTS departments (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) NOT NULL,
      hod_id VARCHAR(64),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 3. Courses
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      academic_years JSONB NOT NULL DEFAULT '[]'::jsonb,
      sections_map JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 4. Users / Profiles
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'principal', 'hod', 'incharge', 'faculty')),
      designation VARCHAR(100),
      department VARCHAR(100),
      assigned_section VARCHAR(255),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 5. Subjects
    CREATE TABLE IF NOT EXISTS subjects (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      credits INT DEFAULT 3,
      type VARCHAR(50) DEFAULT 'Theory',
      department VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 6. Students
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      roll_number VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50) NOT NULL,
      course VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      section VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_student_roll_college UNIQUE (college_id, roll_number)
    );

    -- 7. Sections
    CREATE TABLE IF NOT EXISTS sections (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      course VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      section VARCHAR(50) NOT NULL,
      incharge_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
      incharge_name VARCHAR(255),
      room VARCHAR(50) DEFAULT 'Room 204',
      students_count INT DEFAULT 40,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 8. Timetable Assignments (Faculty Assignments)
    CREATE TABLE IF NOT EXISTS timetable_assignments (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      faculty_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      faculty_name VARCHAR(255) NOT NULL,
      subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE SET NULL,
      subject_name VARCHAR(255) NOT NULL,
      course VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      section VARCHAR(50) NOT NULL,
      day VARCHAR(20) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
      time VARCHAR(50) NOT NULL,
      room VARCHAR(50) DEFAULT 'Room 204',
      period VARCHAR(50) DEFAULT 'Period 1',
      type VARCHAR(50) DEFAULT 'blue',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 9. Attendance Sessions
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      faculty_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
      faculty_name VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      course VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      section VARCHAR(50) NOT NULL,
      date VARCHAR(20) NOT NULL,
      day VARCHAR(20) NOT NULL,
      time VARCHAR(50) NOT NULL,
      total_students INT NOT NULL,
      present_count INT NOT NULL,
      absent_count INT NOT NULL,
      absent_rolls JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 10. Internal Marks
    CREATE TABLE IF NOT EXISTS internal_marks (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
      roll_number VARCHAR(50) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      assignment NUMERIC DEFAULT 0,
      mid1 NUMERIC DEFAULT 0,
      mid2 NUMERIC DEFAULT 0,
      quiz NUMERIC DEFAULT 0,
      total NUMERIC DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_student_subject_marks UNIQUE (college_id, roll_number, subject)
    );

    -- 11. Assignments
    CREATE TABLE IF NOT EXISTS assignments (
      id VARCHAR(64) PRIMARY KEY,
      college_id VARCHAR(64) REFERENCES colleges(id) ON DELETE CASCADE,
      faculty_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
      subject VARCHAR(255) NOT NULL,
      course VARCHAR(100) NOT NULL,
      year VARCHAR(50) NOT NULL,
      section VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      due_date VARCHAR(50) NOT NULL,
      total_marks INT DEFAULT 10,
      description TEXT,
      student_status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 12. Indexes for high performance
    CREATE INDEX IF NOT EXISTS idx_users_college_role ON users(college_id, role);
    CREATE INDEX IF NOT EXISTS idx_students_college_roll ON students(college_id, roll_number);
    CREATE INDEX IF NOT EXISTS idx_timetable_lookup ON timetable_assignments(college_id, faculty_id, day);
    CREATE INDEX IF NOT EXISTS idx_attendance_lookup ON attendance_sessions(college_id, course, year, section, date);
  `;

  await client.query(schemaSql);
  console.log('Schema tables and indexes created successfully!');

  await client.end();
}

setup().catch(console.error);
