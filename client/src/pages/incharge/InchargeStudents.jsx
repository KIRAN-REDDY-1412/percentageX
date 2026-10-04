import { useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function InchargeStudents() {
  const { students } = useCollege();
  const [searchQuery, setSearchQuery] = useState("");

  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  const sectionStudents = students.filter(
    (s) => s.course === course && s.year === year && s.section === section
  );

  const filtered = sectionStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Incharge / Section Students</p>
            <h1>Student Roster ({sectionStudents.length})</h1>
            <p className="page-description">
              Enrolled students in {course} • {year} ({section})
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search section students by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="card-box">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>Attendance %</th>
                  <th>Academic Standing</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="roll-badge">{s.rollNumber}</span>
                    </td>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>
                      <span
                        className={`attendance-pill ${
                          s.attendancePercentage >= 85
                            ? "high"
                            : s.attendancePercentage >= 75
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {s.attendancePercentage || 85}%
                      </span>
                    </td>
                    <td>
                      {s.attendancePercentage < 75 ? (
                        <span className="warning-tag">
                          <AlertCircle size={12} /> Shortage Warning
                        </span>
                      ) : (
                        <span className="safe-tag">Regular</span>
                      )}
                    </td>
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

export default InchargeStudents;
