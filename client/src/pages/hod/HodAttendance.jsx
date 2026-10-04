import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function HodAttendance() {
  const { attendanceLogs } = useCollege();
  const [selectedSection, setSelectedSection] = useState("all");

  const deptLogs = attendanceLogs.filter(
    (l) => l.course.includes("CSE") || l.course.includes("Computer")
  );

  const filtered = deptLogs.filter(
    (l) => selectedSection === "all" || l.section === selectedSection
  );

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Attendance Oversight</p>
            <h1>CSE Attendance Sessions Log</h1>
            <p className="page-description">
              Daily verified attendance records across Computer Science & Engineering classes.
            </p>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="all">All Department Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>
        </div>

        {/* ATTENDANCE RECORDS */}
        <div className="card-box">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Subject</th>
                  <th>Class / Section</th>
                  <th>Teaching Faculty</th>
                  <th>Time Slot</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
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
                      <td>{log.facultyName || "Prof. Rajesh Kumar"}</td>
                      <td>{log.time}</td>
                      <td>
                        <span className="text-green-strong">{log.presentCount}</span>
                      </td>
                      <td>
                        <span className="text-red-strong">{log.absentCount}</span>
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
        </div>
      </div>
    </AppLayout>
  );
}

export default HodAttendance;
