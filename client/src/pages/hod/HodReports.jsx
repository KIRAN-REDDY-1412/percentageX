import { BarChart3, Download, AlertCircle } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

function HodReports() {
  const { showToast } = useToast();

  const atRiskStudents = [
    {
      rollNumber: "2305",
      name: "Rohan Nair",
      course: "B.Tech - CSE",
      year: "2nd Year",
      section: "Section A",
      attendance: "68%",
      issue: "Critical Shortage in DBMS & DSA",
      mentor: "Dr. Meera Nambiar",
    },
    {
      rollNumber: "2319",
      name: "Manish Kumar",
      course: "B.Tech - CSE",
      year: "2nd Year",
      section: "Section A",
      attendance: "71%",
      issue: "Medical Leave Pending Documentation",
      mentor: "Prof. Rajesh Kumar",
    },
  ];

  const handleExport = () => {
    showToast("Preparing CSE Department Academic Report...", "info");
    setTimeout(() => {
      showToast("CSE Department Academic Report exported successfully!", "success");
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Reports</p>
            <h1>CSE Department Analytics</h1>
            <p className="page-description">
              Academic compliance, attendance risk monitoring, and student counseling lists.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export CSE Report</span>
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-box blue">
              <BarChart3 size={24} />
            </div>
            <div className="stat-details">
              <span>Average Attendance</span>
              <strong><StatCounter value={88.4} decimals={1} suffix="%" /></strong>
              <small className="stat-growth green-text">Compliant with University norms</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box orange">
              <AlertCircle size={24} />
            </div>
            <div className="stat-details">
              <span>Attendance Condonation Risk</span>
              <strong><StatCounter value={atRiskStudents.length} /> Students</strong>
              <small className="stat-sub">Below 75% Threshold</small>
            </div>
          </div>
        </div>

        {/* AT RISK TABLE */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Attendance Shortage & Counseling Advisory</h2>
              <p>Students requiring departmental counseling and parent notifications</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Batch / Section</th>
                  <th>Current Attendance</th>
                  <th>Observation / Issue</th>
                  <th>Faculty Mentor</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((st, i) => (
                  <tr key={i}>
                    <td>
                      <span className="roll-badge">{st.rollNumber}</span>
                    </td>
                    <td>
                      <strong>{st.name}</strong>
                    </td>
                    <td>
                      {st.course} • {st.year} ({st.section})
                    </td>
                    <td>
                      <span className="attendance-pill low">{st.attendance}</span>
                    </td>
                    <td>
                      <span className="text-red-strong">{st.issue}</span>
                    </td>
                    <td>{st.mentor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default HodReports;
