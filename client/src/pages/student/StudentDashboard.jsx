import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  ClipboardList,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { getScheduleForSection } from "../../services/timetableService";
import StatCounter from "../../components/common/StatCounter";

function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser, assignmentsPosted, internalMarks, verifiedStudentData } = useCollege();

  // Student profile (Uses verified identity from college verification link)
  const isDemo = !verifiedStudentData?.student && currentUser?.role !== "student";

  // Student profile (Uses verified identity from college verification link)
  const student =
    verifiedStudentData?.student ||
    (currentUser?.role === "student" && currentUser?.course
      ? currentUser
      : isDemo
      ? {
          rollNumber: "2301",
          name: "Rahul Varma",
          course: "B.Tech - CSE",
          year: "2nd Year",
          section: "Section A",
        }
      : currentUser || {
          rollNumber: "N/A",
          name: "Student",
          course: "Course N/A",
          year: "Year N/A",
          section: "Unassigned",
        });

  const hasAssignedSection = Boolean(
    student.section &&
    student.section !== "Unassigned" &&
    student.section !== "Not Assigned"
  );

  // Student's today schedule (Thursday demo)
  const todayDay = "Thursday";
  const studentTodayClasses = hasAssignedSection
    ? getScheduleForSection(
        student.course,
        student.year,
        student.section,
        todayDay
      )
    : [];

  // Attendance metrics from personal verification record
  const attendedClasses =
    verifiedStudentData?.stats?.attended !== undefined
      ? verifiedStudentData.stats.attended
      : isDemo
      ? 42
      : (student.attendedClasses || 0);

  const totalClasses =
    verifiedStudentData?.stats?.totalHeld !== undefined
      ? verifiedStudentData.stats.totalHeld
      : isDemo
      ? 50
      : (student.totalClasses || 0);

  const overallPercentage =
    verifiedStudentData?.stats?.overallPercentage !== undefined
      ? verifiedStudentData.stats.overallPercentage
      : totalClasses > 0
      ? Math.round((attendedClasses / totalClasses) * 100)
      : isDemo
      ? 84
      : (student.attendancePercentage || 0);

  // Pending assignments for this student's class
  const classAssignments = hasAssignedSection
    ? assignmentsPosted.filter(
        (a) =>
          (!a.year || a.year === student.year) &&
          (!a.course || a.course === student.course) &&
          (!a.section || a.section === student.section)
      )
    : [];
  const pendingAssignments = classAssignments.filter(
    (a) => a.studentStatus === "Pending"
  );

  // Latest marks for student
  const studentMarks = (student.rollNumber && internalMarks[student.rollNumber]) || {};
  const hasMarks = Object.keys(studentMarks).length > 0;
  const avgMarks = hasMarks
    ? Math.round(
        Object.values(studentMarks).reduce(
          (acc, curr) => acc + (curr.total || 0),
          0
        ) / Object.values(studentMarks).length
      )
    : 0;

  return (
    <AppLayout>
      <div className="student-dashboard-page page-container-animated">
        {/* WELCOME BANNER */}
        <div className="student-welcome-banner">
          <div>
            <p className="small-heading">Student Portal • {student.rollNumber}</p>
            <h1>Welcome back, {student.name} 👋</h1>
            <p className="page-description">
              {student.course} • {student.year} •{" "}
              {hasAssignedSection ? (
                <span className="section-pill">{student.section}</span>
              ) : (
                <span className="section-pill unassigned">No Section Assigned</span>
              )}
            </p>
          </div>

          <div className="attendance-quick-widget">
            <span>Overall Attendance</span>
            <strong><StatCounter value={overallPercentage} suffix="%" /></strong>
            <small>
              {totalClasses > 0
                ? `${attendedClasses} / ${totalClasses} Classes Attended`
                : "No classes conducted yet"}
            </small>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="admin-stats-grid">
          <div
            className="admin-stat-card"
            onClick={() => navigate("/student/attendance")}
          >
            <div className="stat-icon-box blue">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <span>Attendance Status</span>
              <strong><StatCounter value={overallPercentage} suffix="%" /></strong>
              <small
                className={`stat-growth ${
                  totalClasses === 0
                    ? "text-slate-500"
                    : overallPercentage >= 75
                    ? "green-text"
                    : "red-text"
                }`}
              >
                {totalClasses === 0 ? (
                  "No Sessions Held Yet"
                ) : overallPercentage >= 75 ? (
                  <>
                    <TrendingUp size={12} /> Above 75% Minimum
                  </>
                ) : (
                  "Below 75% Minimum"
                )}
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/student/schedule")}
          >
            <div className="stat-icon-box green">
              <CalendarDays size={24} />
            </div>
            <div className="stat-details">
              <span>Today's Classes</span>
              <strong><StatCounter value={studentTodayClasses.length} /> Classes</strong>
              <small className="stat-sub">
                {hasAssignedSection ? `${todayDay} Timetable` : "Section Not Assigned"}
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/student/assignments")}
          >
            <div className="stat-icon-box orange">
              <ClipboardList size={24} />
            </div>
            <div className="stat-details">
              <span>Assignments</span>
              <strong><StatCounter value={pendingAssignments.length} /> Pending</strong>
              <small className="stat-sub">
                {classAssignments.length - pendingAssignments.length} Submitted
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/student/internal-marks")}
          >
            <div className="stat-icon-box purple">
              <FileText size={24} />
            </div>
            <div className="stat-details">
              <span>Internal Marks</span>
              <strong>{hasMarks ? `${avgMarks} / 40 Avg` : "N/A"}</strong>
              <small className={hasMarks ? "stat-growth green-text" : "stat-sub"}>
                {hasMarks ? "Continuous Assessment" : "No marks entered yet"}
              </small>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="admin-grid-two-columns">
          {/* TODAY'S TIMETABLE */}
          <div className="card-box">
            <div className="card-box-header">
              <div>
                <h2>Today's Class Schedule ({todayDay})</h2>
                <p>
                  {hasAssignedSection
                    ? `Classes for ${student.year} ${student.section}`
                    : "No section assigned yet"}
                </p>
              </div>
              <button
                className="text-btn"
                onClick={() => navigate("/student/schedule")}
              >
                <span>Full Timetable</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="student-classes-timeline">
              {!hasAssignedSection ? (
                <p className="empty-message">
                  You are not assigned to a section yet. Your daily class schedule will appear here once your section is allocated.
                </p>
              ) : studentTodayClasses.length === 0 ? (
                <p className="empty-message">No classes scheduled for today.</p>
              ) : (
                studentTodayClasses.map((item, index) => (
                  <div className="timeline-class-item" key={index}>
                    <div className="timeline-time">
                      <span>{item.time}</span>
                      <small>{item.period || `Period ${index + 1}`}</small>
                    </div>

                    <div className="timeline-details">
                      <h3>{item.subject}</h3>
                      <p>
                        {item.room || "Room 204"} • {item.facultyName}
                      </p>
                    </div>

                    <div className="timeline-badge">
                      <span className="live-status-pill">Enrolled</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE: ASSIGNMENTS & MARKS SNAPSHOT */}
          <div className="admin-sidebar-cards">
            {/* PENDING ASSIGNMENTS */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Pending Assignments</h2>
                <button
                  className="text-btn"
                  onClick={() => navigate("/student/assignments")}
                >
                  View All
                </button>
              </div>

              <div className="student-assignments-mini-list">
                {classAssignments.length === 0 ? (
                  <p className="empty-message" style={{ padding: "12px 0", color: "#64748b", margin: 0 }}>
                    No pending assignments.
                  </p>
                ) : (
                  classAssignments.slice(0, 3).map((asn) => (
                    <div className="mini-asn-item" key={asn.id}>
                      <div className="mini-asn-info">
                        <strong>{asn.title}</strong>
                        <span>
                          {asn.subject} • Due {asn.dueDate}
                        </span>
                      </div>
                      <span
                        className={`status-pill ${
                          asn.studentStatus === "Submitted"
                            ? "submitted"
                            : "pending"
                        }`}
                      >
                        {asn.studentStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* MARKS PREVIEW */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Recent Internal Marks</h2>
                <button
                  className="text-btn"
                  onClick={() => navigate("/student/internal-marks")}
                >
                  Details
                </button>
              </div>

              <div className="mini-marks-list">
                {!hasMarks ? (
                  <p className="empty-message" style={{ padding: "12px 0", color: "#64748b", margin: 0 }}>
                    No internal marks recorded yet.
                  </p>
                ) : (
                  Object.entries(studentMarks).map(([subj, marks]) => (
                    <div className="mini-mark-row" key={subj}>
                      <span>{subj}</span>
                      <strong>{marks.total} / 40</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentDashboard;
