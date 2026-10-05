import { useState } from "react";
import { Search } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function HodStudents() {
  const { students } = useCollege();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const deptStudents = students.filter(
    (s) => s.course.includes("CSE") || s.course.includes("Computer")
  );

  const filtered = deptStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNumber).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === "all" || s.year === yearFilter;
    return matchesSearch && matchesYear;
  });

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Students</p>
            <h1>CSE Student Cohorts ({filtered.length})</h1>
            <p className="page-description">
              Academic roster, year-wise sections, and continuous attendance tracking.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="filter-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <div className="filter-select-wrapper">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Academic Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="card-box">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Program & Year</th>
                  <th>Section</th>
                  <th>Email & Phone</th>
                  <th>Attendance</th>
                  <th>Academic Standing</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <span className="roll-badge">{st.rollNumber}</span>
                    </td>
                    <td>
                      <strong>{st.name}</strong>
                    </td>
                    <td>
                      {st.course} • {st.year}
                    </td>
                    <td>
                      {st.section &&
                      st.section !== "Unassigned" &&
                      st.section !== "Not Assigned" ? (
                        <span className="section-pill">{st.section}</span>
                      ) : (
                        <span className="section-pill unassigned">Not Assigned</span>
                      )}
                    </td>
                    <td>
                      <div className="contact-cell">
                        <small>{st.email}</small>
                        <small className="text-muted">{st.phone}</small>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`attendance-pill ${
                          (st.attendancePercentage ?? 0) >= 85
                            ? "high"
                            : (st.attendancePercentage ?? 0) >= 75
                            ? "medium"
                            : (st.attendancePercentage ?? 0) > 0
                            ? "low"
                            : "neutral"
                        }`}
                      >
                        {st.attendancePercentage ?? 0}%
                      </span>
                    </td>
                    <td>
                      <span className="status-badge active">In Good Standing</span>
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

export default HodStudents;
