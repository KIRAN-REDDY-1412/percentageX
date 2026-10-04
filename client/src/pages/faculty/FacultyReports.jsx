import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Download,
} from "lucide-react";

import FacultyLayout from "../../layouts/FacultyLayout";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

function FacultyReports() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState("attendance");

  const students = 40;
  const present = 36;
  const absent = 4;

  const attendancePercentage = Math.round(
    (present / students) * 100
  );

  const marksData = [
    { roll: "2301", marks: 34 },
    { roll: "2302", marks: 31 },
    { roll: "2303", marks: 28 },
    { roll: "2304", marks: 36 },
    { roll: "2305", marks: 25 },
    { roll: "2306", marks: 32 },
    { roll: "2307", marks: 29 },
    { roll: "2308", marks: 37 },
  ];

  const averageMarks = Math.round(
    marksData.reduce((total, student) => total + student.marks, 0) /
      marksData.length
  );

  const handleDownload = () => {
    showToast("Generating faculty performance report...", "info");
    setTimeout(() => {
      showToast("Report exported successfully!", "success");
    }, 1000);
  };

  return (
    <FacultyLayout>

      <div className="reports-page">

        {/* HEADER */}

        <div className="reports-header">

          <div className="reports-title">

            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="breadcrumb">
                Faculty / Reports
              </p>

              <h1>Reports</h1>

              <p className="reports-subtitle">
                View attendance and academic reports
              </p>
            </div>

          </div>


          <button
            className="download-report-button"
            onClick={handleDownload}
          >
            <Download size={17} />
            Download Report
          </button>

        </div>


        {/* FILTERS */}

        <div className="reports-filter-card">

          <div className="report-filter">

            <label>Class</label>

            <select defaultValue="cse2a">

              <option value="cse2a">
                B.Tech - CSE • 2nd Year • Section A
              </option>

              <option value="cse2b">
                B.Tech - CSE • 2nd Year • Section B
              </option>

              <option value="cse3a">
                B.Tech - CSE • 3rd Year • Section A
              </option>

              <option value="bsc2b">
                B.Sc - MPC • 2nd Year • Section B
              </option>

            </select>

          </div>


          <div className="report-filter">

            <label>Subject</label>

            <select defaultValue="dbms">

              <option value="dbms">
                Database Management Systems
              </option>

              <option value="os">
                Operating Systems
              </option>

              <option value="cn">
                Computer Networks
              </option>

              <option value="java">
                Programming in Java
              </option>

            </select>

          </div>


          <div className="report-filter">

            <label>Academic Year</label>

            <select defaultValue="2026-27">

              <option value="2026-27">
                2026 - 2027
              </option>

              <option value="2025-26">
                2025 - 2026
              </option>

            </select>

          </div>

        </div>


        {/* REPORT TYPE */}

        <div className="report-tabs">

          <button
            className={
              reportType === "attendance"
                ? "report-tab active"
                : "report-tab"
            }
            onClick={() => setReportType("attendance")}
          >
            <CheckCircle size={16} />
            Attendance Report
          </button>


          <button
            className={
              reportType === "marks"
                ? "report-tab active"
                : "report-tab"
            }
            onClick={() => setReportType("marks")}
          >
            <FileText size={16} />
            Internal Marks Report
          </button>

        </div>


        {/* ATTENDANCE REPORT */}

        {reportType === "attendance" && (

          <>

            <div className="report-summary-grid">

              <div className="report-summary-card">

                <div className="report-summary-icon blue">
                  <Users size={20} />
                </div>

                <div>
                  <span>Total Students</span>
                  <strong>{students}</strong>
                </div>

              </div>


              <div className="report-summary-card">

                <div className="report-summary-icon green">
                  <CheckCircle size={20} />
                </div>

                <div>
                  <span>Present</span>
                  <strong>{present}</strong>
                </div>

              </div>


              <div className="report-summary-card">

                <div className="report-summary-icon red">
                  <XCircle size={20} />
                </div>

                <div>
                  <span>Absent</span>
                  <strong>{absent}</strong>
                </div>

              </div>


              <div className="report-summary-card">

                <div className="report-summary-icon purple">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <span>Attendance</span>
                  <strong>
                    {attendancePercentage}%
                  </strong>
                </div>

              </div>

            </div>


            <div className="report-main-card">

              <div className="report-card-header">

                <div>
                  <h2>Attendance Overview</h2>

                  <p>
                    Database Management Systems
                  </p>
                </div>

                <span className="report-date">
                  October 2026
                </span>

              </div>


              <div className="attendance-report-content">

                <div className="attendance-circle">

                  <div>
                    <strong>
                      {attendancePercentage}%
                    </strong>

                    <span>
                      Attendance
                    </span>
                  </div>

                </div>


                <div className="attendance-report-details">

                  <div className="attendance-detail">

                    <span className="detail-dot present-dot"></span>

                    <div>
                      <span>Present</span>
                      <strong>{present} Students</strong>
                    </div>

                  </div>


                  <div className="attendance-detail">

                    <span className="detail-dot absent-dot"></span>

                    <div>
                      <span>Absent</span>
                      <strong>{absent} Students</strong>
                    </div>

                  </div>


                  <div className="attendance-detail">

                    <span className="detail-dot total-dot"></span>

                    <div>
                      <span>Total</span>
                      <strong>{students} Students</strong>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </>

        )}


        {/* MARKS REPORT */}

        {reportType === "marks" && (

          <>

            <div className="report-summary-grid">

              <div className="report-summary-card">

                <div className="report-summary-icon blue">
                  <Users size={20} />
                </div>

                <div>
                  <span>Total Students</span>
                  <strong>{students}</strong>
                </div>

              </div>


              <div className="report-summary-card">

                <div className="report-summary-icon green">
                  <FileText size={20} />
                </div>

                <div>
                  <span>Average Marks</span>
                  <strong>{averageMarks}/40</strong>
                </div>

              </div>


              <div className="report-summary-card">

                <div className="report-summary-icon purple">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <span>Maximum Marks</span>
                  <strong>40</strong>
                </div>

              </div>

            </div>


            <div className="report-main-card">

              <div className="report-card-header">

                <div>
                  <h2>Internal Marks Overview</h2>

                  <p>
                    Database Management Systems
                  </p>
                </div>

                <span className="report-date">
                  Internal Assessment
                </span>

              </div>


              <div className="marks-report-table-wrapper">

                <table className="marks-report-table">

                  <thead>

                    <tr>
                      <th>S.No</th>
                      <th>Roll Number</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                    </tr>

                  </thead>


                  <tbody>

                    {marksData.map((student, index) => (

                      <tr key={student.roll}>

                        <td>{index + 1}</td>

                        <td>
                          <strong>
                            {student.roll}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {student.marks}/40
                          </strong>
                        </td>

                        <td>
                          {Math.round(
                            (student.marks / 40) * 100
                          )}
                          %
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}

      </div>

    </FacultyLayout>
  );
}

export default FacultyReports;