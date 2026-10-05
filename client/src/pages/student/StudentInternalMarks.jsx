import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function StudentInternalMarks() {
  const { currentUser, internalMarks, verifiedStudentData } = useCollege();

  const isDemo = !verifiedStudentData?.student && (!currentUser || currentUser?.role !== "student");
  const rollNumber = verifiedStudentData?.student?.rollNumber || currentUser?.rollNumber || (isDemo ? "2301" : "");
  const marksData = (rollNumber && internalMarks[rollNumber]) || (isDemo ? {
    "Database Management Systems": {
      assignment: 9,
      mid1: 18,
      mid2: 17,
      quiz: 9,
      total: 36,
    },
    "Operating Systems": {
      assignment: 8,
      mid1: 16,
      mid2: 18,
      quiz: 8,
      total: 34,
    },
    "Computer Networks": {
      assignment: 9,
      mid1: 17,
      mid2: 16,
      quiz: 8,
      total: 33,
    },
    "Programming in Java": {
      assignment: 10,
      mid1: 19,
      mid2: 19,
      quiz: 9,
      total: 38,
    },
  } : {});

  const calculateGrade = (total) => {
    if (total >= 36) return { grade: "O (Outstanding)", color: "#16a34a" };
    if (total >= 32) return { grade: "A+ (Excellent)", color: "#2563eb" };
    if (total >= 28) return { grade: "A (Very Good)", color: "#7c3aed" };
    return { grade: "B (Good)", color: "#ea580c" };
  };

  return (
    <AppLayout>
      <div className="student-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Student / Internal Marks</p>
            <h1>Continuous Internal Assessment (CIA)</h1>
            <p className="page-description">
              Breakdown of assignments, midterm examinations, quizzes, and total internals.
            </p>
          </div>
        </div>

        {/* MARKS TABLE CARD */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Internal Assessment Scorecard (Roll No: {rollNumber})</h2>
              <p>Maximum Marks: 40 (Assignment: 10, Midterms: 20, Quiz: 10)</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assignment (10)</th>
                  <th>Mid 1 (20)</th>
                  <th>Mid 2 (20)</th>
                  <th>Quiz (10)</th>
                  <th>Internal Total (40)</th>
                  <th>Performance Band</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(marksData).length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-table-cell"
                      style={{ textAlign: "center", padding: "36px 20px", color: "#64748b" }}
                    >
                      No internal marks recorded yet for this student. Marks will appear once submitted by subject faculty.
                    </td>
                  </tr>
                ) : (
                  Object.entries(marksData).map(([subject, m]) => {
                  const evalGrade = calculateGrade(m.total);
                  return (
                    <tr key={subject}>
                      <td>
                        <strong>{subject}</strong>
                      </td>
                      <td>
                        <span className="marks-val">{m.assignment}</span>
                      </td>
                      <td>
                        <span className="marks-val">{m.mid1}</span>
                      </td>
                      <td>
                        <span className="marks-val">{m.mid2}</span>
                      </td>
                      <td>
                        <span className="marks-val">{m.quiz}</span>
                      </td>
                      <td>
                        <strong className="total-marks-text">
                          {m.total} / 40
                        </strong>
                      </td>
                      <td>
                        <span
                          className="grade-pill"
                          style={{
                            background: `${evalGrade.color}15`,
                            color: evalGrade.color,
                            borderColor: `${evalGrade.color}30`,
                          }}
                        >
                          {evalGrade.grade}
                        </span>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentInternalMarks;
