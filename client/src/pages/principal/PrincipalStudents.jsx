import { useState } from "react";
import { Search } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function PrincipalStudents() {
  const { students } = useCollege();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <AppLayout>
      <div className="principal-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Principal / Student Registry</p>
            <h1>Institutional Student Enrollment</h1>
            <p className="page-description">
              Campus-wide student register across all undergraduate programs.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students across all degrees and sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">All Degree Programs</option>
              <option value="B.Tech - CSE">B.Tech - CSE</option>
              <option value="B.Tech - ECE">B.Tech - ECE</option>
              <option value="B.Sc - MPC">B.Sc - MPC</option>
            </select>
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
                  <th>Program & Year</th>
                  <th>Section</th>
                  <th>Contact Email</th>
                  <th>Attendance %</th>
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
                    <td>
                      {s.course} • {s.year}
                    </td>
                    <td>
                      {s.section &&
                      s.section !== "Unassigned" &&
                      s.section !== "Not Assigned" ? (
                        <span className="section-pill">{s.section}</span>
                      ) : (
                        <span className="section-pill unassigned">Not Assigned</span>
                      )}
                    </td>
                    <td>{s.email}</td>
                    <td>
                      <span
                        className={`attendance-pill ${
                          (s.attendancePercentage ?? 0) >= 85
                            ? "high"
                            : (s.attendancePercentage ?? 0) >= 75
                            ? "medium"
                            : (s.attendancePercentage ?? 0) > 0
                            ? "low"
                            : "neutral"
                        }`}
                      >
                        {s.attendancePercentage ?? 0}%
                      </span>
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

export default PrincipalStudents;
