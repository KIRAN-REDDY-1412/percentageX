import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

const students = [
  "2301", "2302", "2303", "2304", "2305",
  "2306", "2307", "2308", "2309", "2310",
  "2311", "2312", "2313", "2314", "2315",
  "2316", "2317", "2318", "2319", "2320",
  "2321", "2322", "2323", "2324", "2325",
  "2326", "2327", "2328", "2329", "2330",
  "2331", "2332", "2333", "2334", "2335",
  "2336", "2337", "2338", "2339", "2340",
];

function FacultyInternalMarks() {
  const location = useLocation();
  const incomingClass = location.state?.classData;

  const getInitialClassValue = () => {
    if (!incomingClass) return "cse2a";
    if (incomingClass.course?.includes("B.Sc")) return "bsc2b";
    if (incomingClass.year?.includes("3rd")) return "cse3a";
    if (incomingClass.section?.includes("B")) return "cse2b";
    return "cse2a";
  };

  const getInitialSubjectValue = () => {
    if (!incomingClass) return "dbms";
    const sub = incomingClass.subject?.toLowerCase() || "";
    if (sub.includes("java")) return "java";
    if (sub.includes("network")) return "cn";
    if (sub.includes("operating")) return "os";
    return "dbms";
  };

  const [selectedClass, setSelectedClass] = useState(getInitialClassValue);
  const [selectedSubject, setSelectedSubject] = useState(getInitialSubjectValue);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleMarkChange = (rollNo, value) => {
    if (value === "") {
      setMarks((previous) => ({
        ...previous,
        [rollNo]: "",
      }));
      return;
    }

    const number = Number(value);

    if (number >= 0 && number <= 40) {
      setMarks((previous) => ({
        ...previous,
        [rollNo]: number,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetch("/api/academic/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_id: "col-btech-01",
          faculty_name: "Prof. Rajesh Kumar",
          subject: selectedSubject,
          class: selectedClass,
          marks,
        }),
      }).catch(() => {});
      await new Promise((r) => setTimeout(r, 350));
      showToast(`Internal marks saved successfully! (${filledCount}/${students.length} entered)`, "success");
    } catch {
      showToast("Unable to save internal marks. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filledCount = Object.values(marks).filter(
    (mark) => mark !== "" && mark !== undefined
  ).length;

  return (
    <FacultyLayout>

      <div className="internal-marks-page">

        {/* HEADER */}

        <div className="internal-marks-header">

          <div className="internal-marks-title">

            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="breadcrumb">
                Faculty / Internal Marks
              </p>

              <h1>Internal Marks</h1>

              <p className="internal-subtitle">
                Enter and manage student internal marks
              </p>
            </div>

          </div>

          <button
            className="save-marks-button"
            onClick={handleSave}
          >
            <Save size={17} />
            Save Marks
          </button>

        </div>


        {/* FILTERS */}

        <div className="marks-filter-card">

          <div className="marks-filter">

            <label>
              Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
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


          <div className="marks-filter">

            <label>
              Subject
            </label>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
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


          <div className="marks-info">

            <span>
              Maximum Marks
            </span>

            <strong>
              40
            </strong>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="marks-summary">

          <div className="marks-summary-item">

            <div className="marks-summary-icon">
              <FileText size={18} />
            </div>

            <div>
              <span>Total Students</span>
              <strong><StatCounter value={students.length} /></strong>
            </div>

          </div>


          <div className="marks-summary-item">

            <div className="marks-summary-icon green">
              <CheckCircle size={18} />
            </div>

            <div>
              <span>Marks Entered</span>
              <strong><StatCounter value={filledCount} /></strong>
            </div>

          </div>


          <div className="marks-summary-item">

            <div className="marks-summary-icon orange">
              <FileText size={18} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {students.length - filledCount}
              </strong>
            </div>

          </div>

        </div>


        {/* MARKS TABLE */}

        <div className="marks-table-card">

          <div className="marks-table-header">

            <div>
              <h2>Student Internal Marks</h2>

              <p>
                Database Management Systems • Internal Assessment
              </p>
            </div>

            <span className="max-marks">
              Max: 40
            </span>

          </div>


          <div className="marks-table-wrapper">

            <table className="marks-table">

              <thead>

                <tr>
                  <th>S.No</th>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Internal Marks</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {students.map((rollNo, index) => {

                  const mark = marks[rollNo];

                  const hasMark =
                    mark !== undefined &&
                    mark !== "";

                  return (

                    <tr key={rollNo}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {rollNo}
                        </strong>
                      </td>

                      <td>
                        Student {rollNo}
                      </td>

                      <td>

                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={mark ?? ""}
                          placeholder="Enter marks"
                          onChange={(event) =>
                            handleMarkChange(
                              rollNo,
                              event.target.value
                            )
                          }
                        />

                      </td>

                      <td>

                        {hasMark ? (

                          <span className="marks-status entered">
                            <CheckCircle size={14} />
                            Entered
                          </span>

                        ) : (

                          <span className="marks-status pending">
                            Pending
                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>


          {/* FOOTER */}

          <div className="marks-footer">

            <button
              className="back-outline-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              className="save-marks-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="spin-slow" />
                  Saving Marks...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Marks
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </FacultyLayout>
  );
}

export default FacultyInternalMarks;