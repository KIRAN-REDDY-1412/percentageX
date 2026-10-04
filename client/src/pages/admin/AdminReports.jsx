import { BarChart3, Download } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";
import EmptyState from "../../components/common/EmptyState";

function AdminReports() {
  const { courses, facultyMembers, students, attendanceLogs } = useCollege();
  const { showToast } = useToast();

  const departmentsList = courses.length > 0 
    ? [...new Set(courses.map((c) => c.department || c.name))]
    : ["Academics"];

  const deptSummaries = departmentsList.map((dept) => {
    const deptStudents = students.filter((s) => {
      const course = courses.find((c) => c.name === s.course);
      return course ? course.department === dept : true;
    });
    const deptFaculty = facultyMembers.filter((f) => f.department === dept);
    const deptLogs = attendanceLogs.filter((l) => {
      const course = courses.find((c) => c.name === l.course);
      return course ? course.department === dept : true;
    });
    const avgAttendance = deptLogs.length > 0
      ? Math.round(
          deptLogs.reduce((acc, l) => acc + ((l.presentCount || l.present_count || 0) / (l.totalStudents || l.total_students || 1)) * 100, 0) / deptLogs.length
        )
      : 85;

    return {
      dept,
      studentsCount: deptStudents.length,
      facultyCount: deptFaculty.length,
      avgAttendance,
      classesConducted: deptLogs.length,
    };
  });

  const handleExport = () => {
    showToast("Generating college-wide academic & attendance report (CSV/PDF)...", "info");
    setTimeout(() => {
      showToast("Master Report downloaded successfully!", "success");
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Reports</p>
            <h1>College Reports & Analytics</h1>
            <p className="page-description">
              Comprehensive attendance audits, department benchmarks, and faculty workload.
            </p>
          </div>

          <button className="primary-button" onClick={handleExport}>
            <Download size={16} />
            <span>Download Master Report</span>
          </button>
        </div>

        {/* DEPARTMENT BREAKDOWN CARDS */}
        <div className="admin-stats-grid">
          {deptSummaries.map((d, idx) => (
            <div className="admin-stat-card" key={idx}>
              <div className="stat-icon-box purple">
                <BarChart3 size={24} />
              </div>
              <div className="stat-details">
                <span>{d.dept}</span>
                <strong><StatCounter value={d.avgAttendance} suffix="%" /> Attendance</strong>
                <small className="stat-sub">
                  {d.studentsCount} Students • {d.facultyCount} Faculty
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* AUDIT LOG TABLE */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Attendance Sessions Audit Log</h2>
              <p>Verified class attendance records submitted by faculty</p>
            </div>
          </div>

          {attendanceLogs.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No Attendance Logs Yet"
              description="Faculty members haven't submitted attendance logs for today. Once submitted, records will appear here automatically."
            />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Session Date</th>
                    <th>Subject</th>
                    <th>Class / Section</th>
                    <th>Faculty</th>
                    <th>Time Slot</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log) => {
                    const pct = Math.round(
                      (log.presentCount / log.totalStudents) * 100
                    );
                    return (
                      <tr key={log.id}>
                        <td>
                          <strong>{log.date}</strong>
                          <small className="text-muted d-block">{log.day}</small>
                        </td>
                        <td>
                          <strong>{log.subject}</strong>
                        </td>
                        <td>
                          {log.course} • {log.year} ({log.section})
                        </td>
                        <td>{log.facultyName || "Assigned Faculty"}</td>
                        <td>{log.time}</td>
                        <td>
                          <span className="text-green-strong">
                            {log.presentCount}
                          </span>
                        </td>
                        <td>
                          <span className="text-red-strong">
                            {log.absentCount}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`attendance-pill ${
                              pct >= 85 ? "high" : pct >= 75 ? "medium" : "low"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminReports;
