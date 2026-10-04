const { Client } = require('pg');

const poolerUrl = 'postgresql://postgres.dafetilwfgfbmvlwgahc:8cre5oKFHgmkXFSH@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function seed() {
  const client = new Client({
    connectionString: poolerUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected! Seeding initial data into Supabase...');

  // 1. Seed Colleges
  const colleges = [
    {
      id: 'col-btech-01',
      name: 'St. Xavier Institute of Technology',
      code: 'SXIT-BTECH',
      college_type: 'BTECH',
      address: 'Knowledge Park, Hi-Tech City, Hyderabad',
      phone: '+91 40 2345 6789',
      email: 'info@sxit.edu',
      status: 'active',
    },
    {
      id: 'col-degree-02',
      name: 'National College of Arts & Science',
      code: 'NCAS-DEG',
      college_type: 'DEGREE',
      address: 'University Road, Bengaluru',
      phone: '+91 80 2345 9876',
      email: 'admissions@ncas.edu',
      status: 'active',
    },
    {
      id: 'col-junior-03',
      name: 'Apex Junior College',
      code: 'AJC-JR',
      college_type: 'JUNIOR_COLLEGE',
      address: 'MG Road, Vijayawada',
      phone: '+91 866 234 5678',
      email: 'contact@apexjunior.edu',
      status: 'active',
    },
  ];

  for (const c of colleges) {
    await client.query(`
      INSERT INTO colleges (id, name, code, college_type, address, phone, email, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        college_type = EXCLUDED.college_type,
        address = EXCLUDED.address,
        status = EXCLUDED.status;
    `, [c.id, c.name, c.code, c.college_type, c.address, c.phone, c.email, c.status]);
  }

  // 2. Seed Departments
  const departments = [
    { id: 'dept-cse', college_id: 'col-btech-01', name: 'Computer Science & Engineering', code: 'CSE', hod_id: 'usr-hod-cse' },
    { id: 'dept-ece', college_id: 'col-btech-01', name: 'Electronics & Communication', code: 'ECE', hod_id: null },
    { id: 'dept-mech', college_id: 'col-btech-01', name: 'Mechanical Engineering', code: 'MECH', hod_id: null },
    { id: 'dept-sci', college_id: 'col-btech-01', name: 'Sciences & Humanities', code: 'SCI', hod_id: null },
  ];

  for (const d of departments) {
    await client.query(`
      INSERT INTO departments (id, college_id, name, code, hod_id)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING;
    `, [d.id, d.college_id, d.name, d.code, d.hod_id]);
  }

  // 3. Seed Courses
  const courses = [
    {
      id: 'course-cse',
      college_id: 'col-btech-01',
      department_id: 'dept-cse',
      code: 'CSE',
      name: 'B.Tech - CSE',
      full_name: 'Bachelor of Technology in Computer Science & Engineering',
      duration: '4 Years',
      academic_years: JSON.stringify(['1st Year', '2nd Year', '3rd Year', '4th Year']),
      sections_map: JSON.stringify({
        '1st Year': ['Section A', 'Section B'],
        '2nd Year': ['Section A', 'Section B'],
        '3rd Year': ['Section A'],
        '4th Year': ['Section A'],
      }),
    },
    {
      id: 'course-ece',
      college_id: 'col-btech-01',
      department_id: 'dept-ece',
      code: 'ECE',
      name: 'B.Tech - ECE',
      full_name: 'Bachelor of Technology in Electronics & Communication',
      duration: '4 Years',
      academic_years: JSON.stringify(['1st Year', '2nd Year', '3rd Year', '4th Year']),
      sections_map: JSON.stringify({
        '1st Year': ['Section A'],
        '2nd Year': ['Section A'],
        '3rd Year': ['Section A'],
        '4th Year': ['Section A'],
      }),
    },
    {
      id: 'course-mpc',
      college_id: 'col-btech-01',
      department_id: 'dept-sci',
      code: 'MPC',
      name: 'B.Sc - MPC',
      full_name: 'Bachelor of Science (Mathematics, Physics, Chemistry)',
      duration: '3 Years',
      academic_years: JSON.stringify(['1st Year', '2nd Year', '3rd Year']),
      sections_map: JSON.stringify({
        '1st Year': ['Section A'],
        '2nd Year': ['Section A', 'Section B'],
        '3rd Year': ['Section A'],
      }),
    },
  ];

  for (const crs of courses) {
    await client.query(`
      INSERT INTO courses (id, college_id, department_id, code, name, full_name, duration, academic_years, sections_map)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING;
    `, [crs.id, crs.college_id, crs.department_id, crs.code, crs.name, crs.full_name, crs.duration, crs.academic_years, crs.sections_map]);
  }

  // 4. Seed Users for all roles
  const users = [
    {
      id: 'usr-superadmin',
      college_id: null,
      department_id: null,
      email: 'superadmin@percentagex.edu',
      password_hash: 'superadmin123',
      name: 'Dr. Vikram Malhotra',
      phone: '+91 98888 00000',
      role: 'super_admin',
      designation: 'Chief Academic Director & Platform Head',
      department: null,
      assigned_section: null,
    },
    {
      id: 'usr-admin',
      college_id: 'col-btech-01',
      department_id: null,
      email: 'admin@percentagex.edu',
      password_hash: 'admin123',
      name: 'K. Ramesh',
      phone: '+91 98888 11111',
      role: 'admin',
      designation: 'College Administrative Officer',
      department: 'Central Administration',
      assigned_section: null,
    },
    {
      id: 'usr-principal',
      college_id: 'col-btech-01',
      department_id: null,
      email: 'principal@percentagex.edu',
      password_hash: 'principal123',
      name: 'Dr. K. V. S. Murthy',
      phone: '+91 98888 22222',
      role: 'principal',
      designation: 'Principal & Head of Institution',
      department: 'College Governance',
      assigned_section: null,
    },
    {
      id: 'usr-hod-cse',
      college_id: 'col-btech-01',
      department_id: 'dept-cse',
      email: 'hod.cse@percentagex.edu',
      password_hash: 'hod123',
      name: 'Dr. Anand Raman',
      phone: '+91 98888 33333',
      role: 'hod',
      designation: 'Professor & Head of Department',
      department: 'Computer Science & Engineering',
      assigned_section: null,
    },
    {
      id: 'usr-incharge',
      college_id: 'col-btech-01',
      department_id: 'dept-cse',
      email: 'incharge@percentagex.edu',
      password_hash: 'incharge123',
      name: 'Dr. Meera Nambiar',
      phone: '+91 98888 44444',
      role: 'incharge',
      designation: 'Associate Professor & Section Incharge',
      department: 'Computer Science & Engineering',
      assigned_section: 'B.Tech - CSE • 2nd Year • Section A',
    },
    {
      id: 'usr-faculty-rajesh',
      college_id: 'col-btech-01',
      department_id: 'dept-cse',
      email: 'rajesh.kumar@percentagex.edu',
      password_hash: 'faculty123',
      name: 'Prof. Rajesh Kumar',
      phone: '+91 98765 43210',
      role: 'faculty',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      assigned_section: 'B.Tech - CSE • 2nd Year • Section A',
    },
    {
      id: 'usr-faculty-meera',
      college_id: 'col-btech-01',
      department_id: 'dept-cse',
      email: 'meera.nambiar@percentagex.edu',
      password_hash: 'faculty123',
      name: 'Dr. Meera Nambiar',
      phone: '+91 98765 43211',
      role: 'faculty',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      assigned_section: 'B.Tech - CSE • 2nd Year • Section B',
    },
    {
      id: 'usr-faculty-sunita',
      college_id: 'col-btech-01',
      department_id: 'dept-sci',
      email: 'sunita.reddy@percentagex.edu',
      password_hash: 'faculty123',
      name: 'Prof. Sunita Reddy',
      phone: '+91 98765 43212',
      role: 'faculty',
      designation: 'Assistant Professor',
      department: 'Sciences & Humanities',
      assigned_section: 'B.Sc - MPC • 2nd Year • Section B',
    },
  ];

  for (const u of users) {
    await client.query(`
      INSERT INTO users (id, college_id, department_id, email, password_hash, name, phone, role, designation, department, assigned_section)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        department = EXCLUDED.department,
        designation = EXCLUDED.designation,
        assigned_section = EXCLUDED.assigned_section;
    `, [u.id, u.college_id, u.department_id, u.email, u.password_hash, u.name, u.phone, u.role, u.designation, u.department, u.assigned_section]);
  }

  // 5. Seed Subjects
  const subjects = [
    { id: 'sub-dbms', college_id: 'col-btech-01', department_id: 'dept-cse', code: 'CS201', name: 'Database Management Systems', credits: 4, type: 'Theory', department: 'Computer Science & Engineering' },
    { id: 'sub-os', college_id: 'col-btech-01', department_id: 'dept-cse', code: 'CS301', name: 'Operating Systems', credits: 4, type: 'Theory', department: 'Computer Science & Engineering' },
    { id: 'sub-cn', college_id: 'col-btech-01', department_id: 'dept-cse', code: 'CS302', name: 'Computer Networks', credits: 3, type: 'Theory', department: 'Computer Science & Engineering' },
    { id: 'sub-java', college_id: 'col-btech-01', department_id: 'dept-sci', code: 'CS204', name: 'Programming in Java', credits: 4, type: 'Theory', department: 'Sciences & Humanities' },
    { id: 'sub-dsa', college_id: 'col-btech-01', department_id: 'dept-cse', code: 'CS101', name: 'Data Structures & Algorithms', credits: 4, type: 'Theory', department: 'Computer Science & Engineering' },
  ];

  for (const s of subjects) {
    await client.query(`
      INSERT INTO subjects (id, college_id, department_id, code, name, credits, type, department)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING;
    `, [s.id, s.college_id, s.department_id, s.code, s.name, s.credits, s.type, s.department]);
  }

  // 6. Seed Students (Roll numbers 2301 to 2340 + extra)
  const firstNames = [
    'Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Ananya', 'Karthik', 'Divya', 'Siddharth', 'Pooja',
    'Vikram', 'Neha', 'Arjun', 'Tanvi', 'Aditya', 'Megha', 'Varun', 'Ritu', 'Manish', 'Kavya',
    'Naveen', 'Swati', 'Harish', 'Preeti', 'Suresh', 'Bhavna', 'Gaurav', 'Deepa', 'Abhishek', 'Shilpa',
    'Pranav', 'Nandini', 'Rajesh', 'Sangeeta', 'Akash', 'Madhuri', 'Tarun', 'Shweta', 'Nikhil', 'Sunita'
  ];
  const lastNames = [
    'Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Singh', 'Choudhury', 'Joshi',
    'Deshmukh', 'Kulkarni', 'Bose', 'Rao', 'Pillai', 'Menon', 'Kumar', 'Mishra', 'Yadav', 'Saxena',
    'Bhat', 'Shetty', 'Pawar', 'Das', 'Sen', 'Dutta', 'Banerjee', 'Ghosh', 'Chatterjee', 'Roy',
    'Chauhan', 'Mehta', 'Shah', 'Modi', 'Agarwal', 'Bansal', 'Goyal', 'Mittal', 'Singhal', 'Garg'
  ];

  for (let i = 1; i <= 40; i++) {
    const roll = String(2300 + i);
    const firstName = firstNames[i - 1];
    const lastName = lastNames[i - 1];
    const studentId = `stu-${roll}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@percentagex.edu`;
    const phone = `+91 98000 ${roll}`;

    await client.query(`
      INSERT INTO students (id, college_id, roll_number, name, email, phone, course, year, section, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        phone = EXCLUDED.phone,
        email = EXCLUDED.email;
    `, [studentId, 'col-btech-01', roll, `${firstName} ${lastName}`, email, phone, 'B.Tech - CSE', '2nd Year', 'Section A', 'Active']);
  }

  // 7. Seed Timetable Assignments (Authoritative Faculty Weekly Schedules)
  const assignments = [
    // DBMS Sec A (Prof. Rajesh Kumar)
    { id: 'tt-1', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section A', day: 'Monday', time: '09:00 AM - 10:00 AM', room: 'Room 204', period: 'Period 1', type: 'blue' },
    { id: 'tt-2', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section A', day: 'Wednesday', time: '03:00 PM - 04:00 PM', room: 'Room 204', period: 'Period 6', type: 'blue' },
    { id: 'tt-3', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section A', day: 'Thursday', time: '09:00 AM - 10:00 AM', room: 'Room 204', period: 'Period 1', type: 'blue' },
    { id: 'tt-4', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section A', day: 'Friday', time: '09:00 AM - 10:00 AM', room: 'Room 204', period: 'Period 1', type: 'blue' },

    // DBMS Sec B (Prof. Rajesh Kumar)
    { id: 'tt-5', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section B', day: 'Tuesday', time: '10:00 AM - 11:00 AM', room: 'Room 205', period: 'Period 2', type: 'blue' },
    { id: 'tt-6', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section B', day: 'Thursday', time: '10:00 AM - 11:00 AM', room: 'Room 205', period: 'Period 2', type: 'blue' },
    { id: 'tt-7', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-dbms', subject_name: 'Database Management Systems', course: 'B.Tech - CSE', year: '2nd Year', section: 'Section B', day: 'Friday', time: '10:00 AM - 11:00 AM', room: 'Room 205', period: 'Period 2', type: 'blue' },

    // Operating Systems Sec A (Prof. Rajesh Kumar)
    { id: 'tt-8', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-os', subject_name: 'Operating Systems', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Monday', time: '10:00 AM - 11:00 AM', room: 'Room 301', period: 'Period 2', type: 'green' },
    { id: 'tt-9', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-os', subject_name: 'Operating Systems', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Tuesday', time: '11:15 AM - 12:15 PM', room: 'Room 301', period: 'Period 3', type: 'green' },
    { id: 'tt-10', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-os', subject_name: 'Operating Systems', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Thursday', time: '11:15 AM - 12:15 PM', room: 'Room 301', period: 'Period 3', type: 'green' },
    { id: 'tt-11', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-os', subject_name: 'Operating Systems', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Friday', time: '11:15 AM - 12:15 PM', room: 'Room 301', period: 'Period 3', type: 'green' },
    { id: 'tt-12', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-os', subject_name: 'Operating Systems', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Saturday', time: '10:00 AM - 11:00 AM', room: 'Room 301', period: 'Period 2', type: 'green' },

    // Computer Networks Sec A (Prof. Rajesh Kumar)
    { id: 'tt-13', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-cn', subject_name: 'Computer Networks', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Monday', time: '11:15 AM - 12:15 PM', room: 'Room 301', period: 'Period 3', type: 'orange' },
    { id: 'tt-14', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-cn', subject_name: 'Computer Networks', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Wednesday', time: '09:00 AM - 10:00 AM', room: 'Room 301', period: 'Period 1', type: 'orange' },
    { id: 'tt-15', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-cn', subject_name: 'Computer Networks', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Thursday', time: '01:00 PM - 02:00 PM', room: 'Room 301', period: 'Period 4', type: 'orange' },
    { id: 'tt-16', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-cn', subject_name: 'Computer Networks', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Friday', time: '01:00 PM - 02:00 PM', room: 'Room 301', period: 'Period 4', type: 'orange' },
    { id: 'tt-17', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-cn', subject_name: 'Computer Networks', course: 'B.Tech - CSE', year: '3rd Year', section: 'Section A', day: 'Saturday', time: '09:00 AM - 10:00 AM', room: 'Room 301', period: 'Period 1', type: 'orange' },

    // Programming in Java Sec B (Prof. Rajesh Kumar)
    { id: 'tt-18', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-java', subject_name: 'Programming in Java', course: 'B.Sc - MPC', year: '2nd Year', section: 'Section B', day: 'Tuesday', time: '09:00 AM - 10:00 AM', room: 'Lab 1', period: 'Period 1', type: 'purple' },
    { id: 'tt-19', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-java', subject_name: 'Programming in Java', course: 'B.Sc - MPC', year: '2nd Year', section: 'Section B', day: 'Wednesday', time: '10:00 AM - 11:00 AM', room: 'Lab 1', period: 'Period 2', type: 'purple' },
    { id: 'tt-20', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-java', subject_name: 'Programming in Java', course: 'B.Sc - MPC', year: '2nd Year', section: 'Section B', day: 'Thursday', time: '02:15 PM - 03:15 PM', room: 'Lab 1', period: 'Period 5', type: 'purple' },
    { id: 'tt-21', faculty_id: 'usr-faculty-rajesh', faculty_name: 'Prof. Rajesh Kumar', subject_id: 'sub-java', subject_name: 'Programming in Java', course: 'B.Sc - MPC', year: '2nd Year', section: 'Section B', day: 'Friday', time: '02:15 PM - 03:15 PM', room: 'Lab 1', period: 'Period 5', type: 'purple' },
  ];

  for (const a of assignments) {
    await client.query(`
      INSERT INTO timetable_assignments (id, college_id, faculty_id, faculty_name, subject_id, subject_name, course, year, section, day, time, room, period, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING;
    `, [a.id, 'col-btech-01', a.faculty_id, a.faculty_name, a.subject_id, a.subject_name, a.course, a.year, a.section, a.day, a.time, a.room, a.period, a.type]);
  }

  // 8. Seed Attendance Sessions
  const sessions = [
    {
      id: 'att-session-1',
      college_id: 'col-btech-01',
      faculty_id: 'usr-faculty-rajesh',
      faculty_name: 'Prof. Rajesh Kumar',
      subject: 'Database Management Systems',
      course: 'B.Tech - CSE',
      year: '2nd Year',
      section: 'Section A',
      date: '2026-10-01',
      day: 'Thursday',
      time: '09:00 AM - 10:00 AM',
      total_students: 40,
      present_count: 38,
      absent_count: 2,
      absent_rolls: JSON.stringify(['2305', '2319']),
    },
    {
      id: 'att-session-2',
      college_id: 'col-btech-01',
      faculty_id: 'usr-faculty-rajesh',
      faculty_name: 'Prof. Rajesh Kumar',
      subject: 'Database Management Systems',
      course: 'B.Tech - CSE',
      year: '2nd Year',
      section: 'Section A',
      date: '2026-09-30',
      day: 'Wednesday',
      time: '03:00 PM - 04:00 PM',
      total_students: 40,
      present_count: 36,
      absent_count: 4,
      absent_rolls: JSON.stringify(['2302', '2314', '2328', '2335']),
    },
  ];

  for (const s of sessions) {
    await client.query(`
      INSERT INTO attendance_sessions (id, college_id, faculty_id, faculty_name, subject, course, year, section, date, day, time, total_students, present_count, absent_count, absent_rolls)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO NOTHING;
    `, [s.id, s.college_id, s.faculty_id, s.faculty_name, s.subject, s.course, s.year, s.section, s.date, s.day, s.time, s.total_students, s.present_count, s.absent_count, s.absent_rolls]);
  }

  // 9. Seed Internal Marks for student 2301
  const studentMarks = [
    { id: 'mk-1', student_id: 'stu-2301', roll_number: '2301', subject: 'Database Management Systems', assignment: 9, mid1: 18, mid2: 17, quiz: 9, total: 36 },
    { id: 'mk-2', student_id: 'stu-2301', roll_number: '2301', subject: 'Operating Systems', assignment: 8, mid1: 19, mid2: 18, quiz: 10, total: 37 },
    { id: 'mk-3', student_id: 'stu-2301', roll_number: '2301', subject: 'Computer Networks', assignment: 9, mid1: 17, mid2: 16, quiz: 8, total: 34 },
    { id: 'mk-4', student_id: 'stu-2301', roll_number: '2301', subject: 'Data Structures & Algorithms', assignment: 10, mid1: 19, mid2: 19, quiz: 10, total: 39 },
  ];

  for (const m of studentMarks) {
    await client.query(`
      INSERT INTO internal_marks (id, college_id, student_id, roll_number, subject, assignment, mid1, mid2, quiz, total)
      VALUES ($1, 'col-btech-01', $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (college_id, roll_number, subject) DO UPDATE SET
        assignment = EXCLUDED.assignment,
        mid1 = EXCLUDED.mid1,
        mid2 = EXCLUDED.mid2,
        quiz = EXCLUDED.quiz,
        total = EXCLUDED.total;
    `, [m.id, m.student_id, m.roll_number, m.subject, m.assignment, m.mid1, m.mid2, m.quiz, m.total]);
  }

  // 10. Seed Assignments
  const assignmentsData = [
    {
      id: 'asn-1',
      college_id: 'col-btech-01',
      faculty_id: 'usr-faculty-rajesh',
      subject: 'Database Management Systems',
      course: 'B.Tech - CSE',
      year: '2nd Year',
      section: 'Section A',
      title: 'ER Modeling & Relational Schema Normalization (3NF)',
      due_date: '2026-10-15',
      total_marks: 10,
      description: 'Draw comprehensive ER diagram for hospital management system and convert to 3NF schemas with functional dependencies.',
      student_status: 'Pending',
    },
    {
      id: 'asn-2',
      college_id: 'col-btech-01',
      faculty_id: 'usr-faculty-rajesh',
      subject: 'Database Management Systems',
      course: 'B.Tech - CSE',
      year: '2nd Year',
      section: 'Section A',
      title: 'Complex SQL Queries with Window Functions & Subqueries',
      due_date: '2026-10-22',
      total_marks: 10,
      description: 'Write solutions for the 15 queries provided in the lab sheet including rank, dense_rank and lead/lag functions.',
      student_status: 'Submitted',
    },
  ];

  for (const a of assignmentsData) {
    await client.query(`
      INSERT INTO assignments (id, college_id, faculty_id, subject, course, year, section, title, due_date, total_marks, description, student_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO NOTHING;
    `, [a.id, a.college_id, a.faculty_id, a.subject, a.course, a.year, a.section, a.title, a.due_date, a.total_marks, a.description, a.student_status]);
  }

  console.log('Seeding completed successfully!');
  await client.end();
}

seed().catch(console.error);
