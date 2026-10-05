import { BarChart3, AlertCircle, CheckCircle, Download } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

function InchargeReports() {
  const { students } = useCollege();
  const { showToast } = useToast();

  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  const sectionStudents = students.filter(
    (s) => s.course === course && s.year === year && s.section === section
  );

  const atRiskStudents = sectionStudents.filter(
    (s) => s.attendancePercentage !== undefined && s.attendancePercentage > 0 && s.attendancePercentage < 75
  );

  const handleDownload = () => {
    showToast("Generating section attendance and performance report...", "info");
    setTimeout(() => {
      showToast("Section Report exported successfully!", "success");
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="incharge-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Incharge / Section Reports</p>
            <h1>Section Performance & Compliance Reports</h1>
            <p className="page-description">
              Attendance tracking, shortage counseling lists, and academic progress for {year} {section}.
            </p>
          </div>

          <button className="primary-button" onClick={handleDownload}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-box green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-details">
              <span>Regular Attendance</span>
              <strong><StatCounter value={sectionStudents.length - atRiskStudents.length} /> Students</strong>
              <small className="stat-growth green-text">Above 75% Safe Line</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box orange">
              <AlertCircle size={24} />
            </div>
            <div className="stat-details">
              <span>Shortage Notices</span>
              <strong><StatCounter value={atRiskStudents.length} /> Students</strong>
              <small className="text-red">Requires Incharge Counseling</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box blue">
              <BarChart3 size={24} />
            </div>
            <div className="stat-details">
              <span>Class Attendance Mean</span>
              <strong><StatCounter value={88.2} decimals={1} suffix="%" /></strong>
              <small className="stat-growth green-text">Top Quartile in Dept</small>
            </div>
          </div>
        </div>

        {/* SHORTAGE CANDIDATES LIST */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Attendance Shortage Advisory List</h2>
              <p>Students requiring mandatory counseling before end-semester examinations</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Attendance %</th>
                  <th>Deficit Classes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell text-green">
                      Excellent! All students currently maintain attendance ≥ 75%.
                    </td>
                  </tr>
                ) : (
                  atRiskStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="roll-badge">{s.rollNumber}</span>
                      </td>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td>
                        <span className="attendance-pill low">
                          {s.attendancePercentage}%
                        </span>
                      </td>
                      <td>Need to attend next 5 lectures consecutively</td>
                      <td>
                        <span className="warning-tag">Advisory Issued</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default InchargeReports;
