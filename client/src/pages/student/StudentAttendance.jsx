import { AlertCircle } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function StudentAttendance() {
  const { currentUser, verifiedStudentData } = useCollege();

  const isDemo = !verifiedStudentData?.student && (!currentUser || currentUser?.role !== "student");

  const student =
    verifiedStudentData?.student ||
    (currentUser?.course
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

  // Overall attendance metrics
  const totalClasses =
    verifiedStudentData?.stats?.totalHeld !== undefined
      ? verifiedStudentData.stats.totalHeld
      : isDemo
      ? 50
      : 0;

  const attendedClasses =
    verifiedStudentData?.stats?.attended !== undefined
      ? verifiedStudentData.stats.attended
      : isDemo
      ? 42
      : 0;

  const missedClasses = Math.max(0, totalClasses - attendedClasses);
  const overallPercentage =
    verifiedStudentData?.stats?.overallPercentage !== undefined
      ? verifiedStudentData.stats.overallPercentage
      : totalClasses > 0
      ? Math.round((attendedClasses / totalClasses) * 100)
      : isDemo
      ? 84
      : (student.attendancePercentage || 0);

  // Subject-wise attendance breakdown
  const subjectAttendance =
    verifiedStudentData?.subjectAttendance?.length > 0
      ? verifiedStudentData.subjectAttendance.map((s) => ({
          subject: s.subject,
          code: s.code || "",
          faculty: s.faculty || "",
          attended: s.attended || 0,
          total: s.total || 0,
          percentage: s.percentage || 0,
          status: s.percentage >= 75 ? "Safe" : "Low Attendance Warning",
        }))
      : isDemo
      ? [
          {
            subject: "Database Management Systems",
            code: "CS201",
            faculty: "Prof. Rajesh Kumar",
            attended: 18,
            total: 20,
            percentage: 90.0,
            status: "Safe",
          },
          {
            subject: "Operating Systems",
            code: "CS301",
            faculty: "Prof. Rajesh Kumar",
            attended: 12,
            total: 14,
            percentage: 85.7,
            status: "Safe",
          },
          {
            subject: "Computer Networks",
            code: "CS302",
            faculty: "Prof. Rajesh Kumar",
            attended: 10,
            total: 12,
            percentage: 83.3,
            status: "Safe",
          },
          {
            subject: "Data Structures & Algorithms",
            code: "CS101",
            faculty: "Dr. Meera Nambiar",
            attended: 2,
            total: 4,
            percentage: 50.0,
            status: "Low Attendance Warning",
          },
        ]
      : [];

  return (
    <AppLayout>
      <div className="student-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Student / Attendance</p>
            <h1>My Attendance Record</h1>
            <p className="page-description">
              Verified attendance logs for {student.course} • {student.year} (
              {hasAssignedSection ? student.section : "No Section Assigned"})
            </p>
          </div>
        </div>

        {/* OVERALL ATTENDANCE HERO SUMMARY */}
        <div className="student-attendance-hero">
          <div className="hero-percentage-circle">
            <h2>{overallPercentage}%</h2>
            <span>Overall Attendance</span>
          </div>

          <div className="hero-stats-blocks">
            <div className="hero-stat-block">
              <span className="label">Total Classes Held</span>
              <strong className="value">{totalClasses}</strong>
            </div>

            <div className="hero-stat-block">
              <span className="label text-green">Classes Attended</span>
              <strong className="value text-green">{attendedClasses}</strong>
            </div>

            <div className="hero-stat-block">
              <span className="label text-red">Classes Missed</span>
              <strong className="value text-red">{missedClasses}</strong>
            </div>

            <div className="hero-stat-block">
              <span className="label">Attendance Requirement</span>
              <strong className="value">75% Minimum</strong>
            </div>
          </div>
        </div>

        {/* SUBJECT-WISE ATTENDANCE BREAKDOWN */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Subject-wise Attendance Breakdown</h2>
              <p>Detailed tracking of lectures attended per subject</p>
            </div>
          </div>

          <div className="subject-attendance-grid">
            {subjectAttendance.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "36px 20px",
                  textAlign: "center",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  color: "#64748b",
                }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#334155" }}>
                  No subject attendance records found yet.
                </p>
                <small style={{ color: "#94a3b8" }}>
                  Subject-wise breakdown will appear here once attendance sessions are logged by your faculty.
                </small>
              </div>
            ) : (
              subjectAttendance.map((item, idx) => (
                <div className="subject-attendance-card" key={idx}>
                  <div className="sub-att-header">
                    <div>
                      <h3>{item.subject}</h3>
                      <span className="sub-code-text">
                        {item.code} • {item.faculty}
                      </span>
                    </div>
                    <span
                      className={`percentage-badge ${
                        item.percentage >= 85
                          ? "high"
                          : item.percentage >= 75
                          ? "medium"
                          : "low"
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="attendance-progress-bar-container">
                    <div
                      className={`attendance-progress-fill ${
                        item.percentage >= 75 ? "green" : "red"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>

                  <div className="sub-att-counts-row">
                    <div>
                      <span>Attended:</span>
                      <strong>{item.attended} Lectures</strong>
                    </div>
                    <div>
                      <span>Total Held:</span>
                      <strong>{item.total} Lectures</strong>
                    </div>
                  </div>

                  {item.percentage < 75 && (
                    <div className="low-att-alert">
                      <AlertCircle size={14} />
                      <span>Attendance below 75% threshold! Attend next classes.</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentAttendance;
