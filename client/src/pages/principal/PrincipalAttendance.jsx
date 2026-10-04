import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  X,
  Save,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function PrincipalAttendance() {
  const { attendanceLogs, updateAttendanceLog } = useCollege();
  const { showToast } = useToast();

  // Filters
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Editing state for Principal override
  const [editingLog, setEditingLog] = useState(null);
  const [editFormData, setEditFormData] = useState({
    presentCount: 0,
    absentCount: 0,
  });

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesCourse = courseFilter === "all" || log.course === courseFilter;
    const matchesYear = yearFilter === "all" || log.year === yearFilter;
    const matchesSection = sectionFilter === "all" || log.section === sectionFilter;
    const matchesDate = !dateFilter || log.date === dateFilter;
    return matchesCourse && matchesYear && matchesSection && matchesDate;
  });

  // Calculate college totals based on current view
  const totalPresent = filteredLogs.reduce((acc, l) => acc + l.presentCount, 0);
  const totalAbsent = filteredLogs.reduce((acc, l) => acc + l.absentCount, 0);
  const grandTotal = totalPresent + totalAbsent;
  const averagePercentage = grandTotal > 0 ? Math.round((totalPresent / grandTotal) * 100) : 0;

  const handleOpenEdit = (log) => {
    setEditingLog(log);
    setEditFormData({
      presentCount: log.presentCount,
      absentCount: log.absentCount,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingLog) return;
    const pCount = Number(editFormData.presentCount);
    const aCount = Number(editFormData.absentCount);
    updateAttendanceLog(editingLog.id, {
      presentCount: pCount,
      absentCount: aCount,
      totalStudents: pCount + aCount,
    });
    setEditingLog(null);
    showToast("Attendance record updated by Principal authority!", "success");
  };

  return (
    <AppLayout>
      <div className="principal-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Principal / Attendance Audit</p>
            <h1>College-wide Attendance Oversight</h1>
            <p className="page-description">
              Verify lecture attendance, inspect section percentages, and authorize adjustments.
            </p>
          </div>
        </div>

        {/* COLLEGE-WIDE ATTENDANCE KPI BANNER */}
        <div className="college-attendance-summary-banner">
          <div className="kpi-card-inner">
            <span>Total Headcount Logged</span>
            <strong>{grandTotal}</strong>
            <small>Lectures Audited</small>
          </div>

          <div className="kpi-card-inner green">
            <CheckCircle size={20} className="green-text" />
            <span>Total Students Present</span>
            <strong>{totalPresent}</strong>
            <small className="green-text">{averagePercentage}% Compliance</small>
          </div>

          <div className="kpi-card-inner red">
            <XCircle size={20} className="red-text" />
            <span>Total Students Absent</span>
            <strong>{totalAbsent}</strong>
            <small className="red-text">Requires Follow-up</small>
          </div>
        </div>

        {/* MULTI-CRITERIA FILTERS CARD */}
        <div className="filters-bar-card">
          <div className="multi-filters-group">
            <div className="filter-select-wrapper">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">All Programs</option>
                <option value="B.Tech - CSE">B.Tech - CSE</option>
                <option value="B.Tech - ECE">B.Tech - ECE</option>
                <option value="B.Sc - MPC">B.Sc - MPC</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="all">All Sections</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>

            <div className="filter-date-wrapper">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by Date"
              />
            </div>
          </div>
        </div>

        {/* ATTENDANCE RECORDS TABLE */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Audited Class Attendance Sessions ({filteredLogs.length})</h2>
              <p>Section attendance logs recorded by faculty members</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Day</th>
                  <th>Subject</th>
                  <th>Course & Section</th>
                  <th>Faculty</th>
                  <th>Time</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-table-cell">
                      No attendance sessions found for selected filters.
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
                        <td>
                          {log.course} • {log.year} ({log.section})
                        </td>
                        <td>{log.facultyName || "Prof. Rajesh Kumar"}</td>
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
                        <td>
                          <button
                            className="outline-button small"
                            onClick={() => handleOpenEdit(log)}
                            title="Edit / Audit Attendance Session"
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT ATTENDANCE MODAL FOR PRINCIPAL */}
        {editingLog && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setEditingLog(null)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Audit & Edit Attendance Session</h3>
                  <p>
                    {editingLog.subject} • {editingLog.year} ({editingLog.section})
                  </p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setEditingLog(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="modal-form-body">
                <div className="form-group">
                  <label>Session Date</label>
                  <input type="text" disabled value={`${editingLog.date} (${editingLog.day})`} />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Verified Present Count</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editFormData.presentCount}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          presentCount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Verified Absent Count</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editFormData.absentCount}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          absentCount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setEditingLog(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <Save size={16} />
                    <span>Authorize Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default PrincipalAttendance;
