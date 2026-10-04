import { BarChart3, Download, Award, TrendingUp } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

function PrincipalReports() {
  const { showToast } = useToast();

  const handleExport = () => {
    showToast("Generating Principal Executive Institutional Report...", "info");
    setTimeout(() => {
      showToast("Institutional Report exported successfully!", "success");
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="principal-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Principal / Institutional Reports</p>
            <h1>Institutional Academic Reports</h1>
            <p className="page-description">
              Accreditation compliance, department comparisons, and semester evaluations.
            </p>
          </div>

          <button className="primary-button" onClick={handleExport}>
            <Download size={16} />
            <span>Export Institutional Report</span>
          </button>
        </div>

        {/* METRICS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-box purple">
              <Award size={24} />
            </div>
            <div className="stat-details">
              <span>NBA / NAAC Compliance</span>
              <strong>Grade A+</strong>
              <small className="stat-growth green-text">Accredited</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box blue">
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <span>Overall Campus Attendance</span>
              <strong><StatCounter value={88.4} decimals={1} suffix="%" /></strong>
              <small className="stat-growth green-text">+3.2% vs Last Term</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box green">
              <BarChart3 size={24} />
            </div>
            <div className="stat-details">
              <span>Exam Eligibility</span>
              <strong><StatCounter value={94.2} decimals={1} suffix="%" /> Eligible</strong>
              <small className="stat-sub">Above 75% Cutoff</small>
            </div>
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Departmental Performance Summary</h2>
              <p>Key academic indicators across college departments</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Programs</th>
                  <th>Faculty Count</th>
                  <th>Student Enrollment</th>
                  <th>Attendance Mean</th>
                  <th>Curriculum Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Computer Science & Engineering</strong>
                  </td>
                  <td>B.Tech (CSE)</td>
                  <td>3 Professors</td>
                  <td>118 Students</td>
                  <td>
                    <span className="attendance-pill high">88.5%</span>
                  </td>
                  <td>68% Completed</td>
                </tr>
                <tr>
                  <td>
                    <strong>Electronics & Communication</strong>
                  </td>
                  <td>B.Tech (ECE)</td>
                  <td>2 Professors</td>
                  <td>75 Students</td>
                  <td>
                    <span className="attendance-pill high">85.0%</span>
                  </td>
                  <td>65% Completed</td>
                </tr>
                <tr>
                  <td>
                    <strong>Sciences & Mathematics</strong>
                  </td>
                  <td>B.Sc (MPC)</td>
                  <td>1 Professor</td>
                  <td>40 Students</td>
                  <td>
                    <span className="attendance-pill high">91.2%</span>
                  </td>
                  <td>72% Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default PrincipalReports;
