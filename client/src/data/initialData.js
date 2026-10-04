/**
 * PercentageX - Academic Data Store
 * Clean multi-tenant production initialization:
 * - Super Admin platform authority
 * - Colleges, Courses, Faculty, Students dynamically provisioned per institution
 */

export const INITIAL_USERS = {
  super_admin: {
    id: "usr-superadmin",
    name: "Platform Super Admin",
    role: "super_admin",
    roleLabel: "Platform Super Administrator",
    email: "kiranreddy0509@gmail.com",
    phone: "+91 98888 00000",
    avatar: "SA",
    department: "Platform Governance",
  },
};

export const INITIAL_COLLEGES = [];
export const INITIAL_COURSES = [];
export const INITIAL_SUBJECTS = [];
export const INITIAL_FACULTY_MEMBERS = [];
export const INITIAL_STUDENTS = [];
export const INITIAL_ASSIGNMENTS = [];
export const INITIAL_ATTENDANCE_LOGS = [];
export const INITIAL_INTERNAL_MARKS = {};
export const INITIAL_ASSIGNMENTS_POSTED = [];
