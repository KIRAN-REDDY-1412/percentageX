import { AlertCircle } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function StudentAttendance() {
  const { currentUser, verifiedStudentData } = useCollege();

  const student =
    verifiedStudentData?.student ||
    (currentUser?.course
      ? currentUser
      : {
          rollNumber: "2301",
          name: "Rahul Varma",
          course: "B.Tech - CSE",
          year: "2nd Year",
          section: "Section A",
        });

  // Overall attendance metrics
  const totalClasses = verifiedStudentData?.stats?.totalHeld || 50;
  const attendedClasses = verifiedStudentData?.stats?.attended || 42;
  const missedClasses = totalClasses - attendedClasses;
  const overallPercentage =
    verifiedStudentData?.stats?.overallPercentage ||
    Math.round((attendedClasses / totalClasses) * 100);

  // Subject-wise attendance breakdown
  const subjectAttendance =
    verifiedStudentData?.subjectAttendance?.length > 0
      ? verifiedStudentData.subjectAttendance.map((s) => ({
          subject: s.subject,
          code: s.code || "CS" + Math.floor(100 + Math.random() * 200),
          faculty: s.faculty || "Prof. Rajesh Kumar",
          attended: s.attended,
          total: s.total,
          percentage: s.percentage,
          status: s.percentage >= 75 ? "Safe" : "Low Attendance Warning",
        }))
      : [
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
  ];

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
              {student.section})
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
            {subjectAttendance.map((item, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentAttendance;
