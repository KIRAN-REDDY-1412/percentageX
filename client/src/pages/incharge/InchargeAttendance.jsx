import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function InchargeAttendance() {
  const { attendanceLogs } = useCollege();

  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  const sectionLogs = attendanceLogs.filter(
    (l) => l.course === course && l.year === year && l.section === section
  );

  const filteredLogs = sectionLogs;

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Incharge / Attendance Oversight</p>
            <h1>Section Attendance Log</h1>
            <p className="page-description">
              Daily attendance logs for {course} • {year} ({section})
            </p>
          </div>
        </div>

        {/* ATTENDANCE RECORDS */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Class Attendance Sessions ({filteredLogs.length})</h2>
              <p>Audited records with absent student roll tracking</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Subject</th>
                  <th>Time Slot</th>
                  <th>Faculty</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Absent Roll Numbers</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-table-cell">
                      No attendance logs recorded for this section yet.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
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
                        <td>{log.time}</td>
                        <td>{log.facultyName || "Prof. Rajesh Kumar"}</td>
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
                          <div className="absent-rolls-pills">
                            {(log.absentRolls || []).length > 0 ? (
                              log.absentRolls.map((r, i) => (
                                <span key={i} className="absent-roll-tag">
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-sm">All Present</span>
                            )}
                          </div>
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default InchargeAttendance;
