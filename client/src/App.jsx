import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { CollegeProvider } from "./context/CollegeContext";
import { ToastProvider } from "./context/ToastContext";

// Public
import LandingPage from "./pages/public/LandingPage";

// Auth
import StaffAccessLogin from "./pages/auth/StaffAccessLogin";
import StudentAccessLogin from "./pages/student/StudentAccessLogin";
import RequireSuperAdmin from "./components/common/RequireSuperAdmin";
import RequireAdmin from "./components/common/RequireAdmin";

// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import Colleges from "./pages/superadmin/Colleges";
import CreateCollege from "./pages/superadmin/CreateCollege";

// HOD Pages
import HodDashboard from "./pages/hod/HodDashboard";
import HodFaculty from "./pages/hod/HodFaculty";
import HodStudents from "./pages/hod/HodStudents";
import HodSections from "./pages/hod/HodSections";
import HodSchedule from "./pages/hod/HodSchedule";
import HodAttendance from "./pages/hod/HodAttendance";
import HodReports from "./pages/hod/HodReports";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultySchedule from "./pages/faculty/FacultySchedule";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyInternalMarks from "./pages/faculty/FacultyInternalMarks";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import FacultyReports from "./pages/faculty/FacultyReports";
import MyClasses from "./pages/faculty/MyClasses";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminSections from "./pages/admin/AdminSections";
import AdminTimetable from "./pages/admin/AdminTimetable";
import AdminReports from "./pages/admin/AdminReports";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentInternalMarks from "./pages/student/StudentInternalMarks";
import StudentAssignments from "./pages/student/StudentAssignments";

// Principal Pages
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import PrincipalAttendance from "./pages/principal/PrincipalAttendance";
import PrincipalFaculty from "./pages/principal/PrincipalFaculty";
import PrincipalStudents from "./pages/principal/PrincipalStudents";
import PrincipalReports from "./pages/principal/PrincipalReports";

// Incharge Pages
import InchargeDashboard from "./pages/incharge/InchargeDashboard";
import InchargeSection from "./pages/incharge/InchargeSection";
import InchargeAttendance from "./pages/incharge/InchargeAttendance";
import InchargeStudents from "./pages/incharge/InchargeStudents";
import InchargeSchedule from "./pages/incharge/InchargeSchedule";
import InchargeReports from "./pages/incharge/InchargeReports";

// Common
import Profile from "./pages/common/Profile";

function App() {
  return (
    <CollegeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Landing & Portal Selector */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Staff Gateways */}
          <Route path="/staff/:collegeIdentifier" element={<StaffAccessLogin />} />
          <Route path="/staff" element={<StaffAccessLogin />} />
          <Route path="/login" element={<StaffAccessLogin />} />

          {/* Dedicated Student Gateways */}
          <Route path="/student" element={<StudentAccessLogin />} />
          <Route path="/student/:collegeIdentifier" element={<StudentAccessLogin />} />
          <Route path="/student-access/:collegeIdentifier" element={<StudentAccessLogin />} />
          <Route path="/student-access" element={<StudentAccessLogin />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin/login" element={<StaffAccessLogin isSuperAdminPortal={true} />} />
          <Route path="/super-admin" element={<RequireSuperAdmin><SuperAdminDashboard /></RequireSuperAdmin>} />
          <Route path="/super-admin/dashboard" element={<RequireSuperAdmin><SuperAdminDashboard /></RequireSuperAdmin>} />
          <Route path="/super-admin/colleges" element={<RequireSuperAdmin><Colleges /></RequireSuperAdmin>} />
          <Route path="/super-admin/colleges/create" element={<RequireSuperAdmin><CreateCollege /></RequireSuperAdmin>} />
          <Route path="/super-admin/profile" element={<RequireSuperAdmin><Profile /></RequireSuperAdmin>} />

          {/* HOD Routes (B.Tech Department Authority) */}
          <Route path="/hod" element={<HodDashboard />} />
          <Route path="/hod/dashboard" element={<HodDashboard />} />
          <Route path="/hod/faculty" element={<HodFaculty />} />
          <Route path="/hod/students" element={<HodStudents />} />
          <Route path="/hod/sections" element={<HodSections />} />
          <Route path="/hod/schedule" element={<HodSchedule />} />
          <Route path="/hod/attendance" element={<HodAttendance />} />
          <Route path="/hod/reports" element={<HodReports />} />
          <Route path="/hod/profile" element={<Profile />} />

          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/schedule" element={<FacultySchedule />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/internal-marks" element={<FacultyInternalMarks />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/reports" element={<FacultyReports />} />
          <Route path="/faculty/classes" element={<MyClasses />} />
          <Route path="/faculty/my-classes" element={<MyClasses />} />
          <Route path="/faculty/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/faculty" element={<RequireAdmin><AdminFaculty /></RequireAdmin>} />
          <Route path="/admin/students" element={<RequireAdmin><AdminStudents /></RequireAdmin>} />
          <Route path="/admin/courses" element={<RequireAdmin><AdminCourses /></RequireAdmin>} />
          <Route path="/admin/subjects" element={<RequireAdmin><AdminSubjects /></RequireAdmin>} />
          <Route path="/admin/sections" element={<RequireAdmin><AdminSections /></RequireAdmin>} />
          <Route path="/admin/timetable" element={<RequireAdmin><AdminTimetable /></RequireAdmin>} />
          <Route path="/admin/reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />
          <Route path="/admin/profile" element={<RequireAdmin><Profile /></RequireAdmin>} />

          {/* Student Authenticated Portal */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          <Route path="/student/internal-marks" element={<StudentInternalMarks />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/profile" element={<Profile />} />

          {/* Principal Routes */}
          <Route path="/principal" element={<PrincipalDashboard />} />
          <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
          <Route path="/principal/attendance" element={<PrincipalAttendance />} />
          <Route path="/principal/faculty" element={<PrincipalFaculty />} />
          <Route path="/principal/students" element={<PrincipalStudents />} />
          <Route path="/principal/reports" element={<PrincipalReports />} />
          <Route path="/principal/profile" element={<Profile />} />

          {/* Incharge Routes */}
          <Route path="/incharge" element={<InchargeDashboard />} />
          <Route path="/incharge/dashboard" element={<InchargeDashboard />} />
          <Route path="/incharge/section" element={<InchargeSection />} />
          <Route path="/incharge/attendance" element={<InchargeAttendance />} />
          <Route path="/incharge/students" element={<InchargeStudents />} />
          <Route path="/incharge/schedule" element={<InchargeSchedule />} />
          <Route path="/incharge/reports" element={<InchargeReports />} />
          <Route path="/incharge/profile" element={<Profile />} />

          {/* General Profile Fallback */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </CollegeProvider>
  );
}

export default App;