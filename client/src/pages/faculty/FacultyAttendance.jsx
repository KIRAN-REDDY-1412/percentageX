import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import FacultyLayout from "../../layouts/FacultyLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";
import {
  getAssignedClasses,
  parseDateYMD,
} from "../../services/timetableService";

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

function FacultyAttendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitAttendanceLog } = useCollege();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  /*
    Class information comes dynamically from My Classes
    or View Schedule.
  */
  const defaultClass = getAssignedClasses()[0];
  const defaultSlot = defaultClass?.schedule[0];

  const selectedClass = location.state?.classData || {
    subject: defaultClass?.subject || "Database Management Systems",
    course: defaultClass?.course || "B.Tech - CSE",
    year: defaultClass?.year || "2nd Year",
    section: defaultClass?.section || "Section A",
    time: defaultSlot?.time || "09:00 AM - 10:00 AM",
    period: defaultSlot?.period || "Period 1",
    day: defaultSlot?.day || "Monday",
  };

  /*
    Date comes from View Schedule or My Classes.
    Using timezone-safe parsing prevents date shifting.
  */
  const selectedDateStr =
    location.state?.selectedDate || "2026-10-01";

  const dateObject = parseDateYMD(selectedDateStr);

  const formattedDate = dateObject.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dayName =
    location.state?.selectedDay ||
    selectedClass.day ||
    dateObject.toLocaleDateString("en-US", {
      weekday: "long",
    });

  /* -----------------------------------------
     ATTENDANCE STATE
     Every student is initially PRESENT.
  ----------------------------------------- */
  const [attendance, setAttendance] = useState(() =>
    students.reduce((result, rollNo) => {
      result[rollNo] = "present";
      return result;
    }, {})
  );

  /*
    Student card click toggles:
    Present → Absent
    Absent → Present
  */
  const toggleAttendance = (rollNo) => {
    setAttendance((previous) => ({
      ...previous,
      [rollNo]:
        previous[rollNo] === "present" ? "absent" : "present",
    }));
  };

  /* -----------------------------------------
     COUNTS
  ----------------------------------------- */
  const presentCount = Object.values(attendance).filter(
    (status) => status === "present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (status) => status === "absent"
  ).length;

  /* -----------------------------------------
     SUBMIT
  ----------------------------------------- */
  const handleSubmit = async () => {
    setSubmitting(true);

    const absentRolls = Object.keys(attendance).filter(
      (roll) => attendance[roll] === "absent"
    );

    try {
      submitAttendanceLog({
        date: selectedDateStr,
        day: dayName,
        subject: selectedClass.subject,
        course: selectedClass.course,
        year: selectedClass.year,
        section: selectedClass.section,
        time: selectedClass.time,
        totalStudents: students.length,
        presentCount,
        absentCount,
        absentRolls,
        facultyName: "Prof. Rajesh Kumar",
      });

      // API call to backend
      fetch("/api/academic/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_id: "col-btech-01",
          faculty_name: "Prof. Rajesh Kumar",
          subject: selectedClass.subject,
          course: selectedClass.course,
          year: selectedClass.year,
          section: selectedClass.section,
          date: selectedDateStr,
          day: dayName,
          time: selectedClass.time,
          total_students: students.length,
          present_count: presentCount,
          absent_count: absentCount,
          absent_rolls: absentRolls,
        }),
      }).catch(() => {});

      await new Promise((r) => setTimeout(r, 400));
      setIsSaved(true);
      showToast(
        `Attendance saved for ${selectedClass.subject} (${selectedClass.section}): ${presentCount} Present, ${absentCount} Absent.`,
        "success"
      );
    } catch {
      showToast("Unable to record attendance. Please retry.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FacultyLayout>
      <div className="attendance-page">
        {/* HEADER */}
        <div className="attendance-header">
          <div className="attendance-title">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="breadcrumb">
                Faculty / Attendance
              </p>
              <h1>Mark Attendance</h1>
            </div>
          </div>

          {/* DATE */}
          <button className="attendance-date">
            <CalendarDays size={17} />
            {formattedDate}
          </button>
        </div>

        {/* CLASS INFORMATION */}
        <div className="attendance-class-card">
          {/* CLASS */}
          <div>
            <span className="attendance-label">Class</span>
            <h2>{selectedClass.course}</h2>
            <p>
              {selectedClass.year}&nbsp;•&nbsp;{selectedClass.section}
            </p>
          </div>

          {/* SUBJECT */}
          <div>
            <span className="attendance-label">Subject</span>
            <h3>{selectedClass.subject}</h3>
            <p>{selectedClass.period || "Class Period"}</p>
          </div>

          {/* TIME */}
          <div>
            <span className="attendance-label">Time & Day</span>
            <h3>{selectedClass.time}</h3>
            <p>{dayName}</p>
          </div>
        </div>

        {/* STUDENT LIST */}
        <div className="student-list-card">
          <div className="student-list-header">
            <div>
              <h2>Student List</h2>
              <p>Tap a student to mark absent</p>
            </div>

            {/* SUMMARY */}
            <div className="attendance-summary">
              <div className="summary-item present-summary">
                <CheckCircle size={17} />
                <span>Present</span>
                <strong><StatCounter value={presentCount} /></strong>
              </div>

              <div className="summary-item absent-summary">
                <XCircle size={17} />
                <span>Absent</span>
                <strong><StatCounter value={absentCount} /></strong>
              </div>
            </div>
          </div>

          {/* STUDENTS */}
          <div className="student-grid">
            {students.map((rollNo) => {
              const isPresent = attendance[rollNo] === "present";

              return (
                <button
                  key={rollNo}
                  className={`student-attendance-card ${
                    isPresent
                      ? "student-present"
                      : "student-absent"
                  }`}
                  onClick={() => toggleAttendance(rollNo)}
                >
                  <div className="student-status-icon">
                    {isPresent ? (
                      <CheckCircle size={19} />
                    ) : (
                      <XCircle size={19} />
                    )}
                  </div>

                  <div className="student-roll-number">
                    {rollNo}
                  </div>

                  <div className="student-status-text">
                    {isPresent ? "Present" : "Absent"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="attendance-footer">
            <button
              className="back-outline-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              className="submit-attendance-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="spin-slow" />
                  Saving Attendance...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle size={17} />
                  Attendance Saved
                </>
              ) : (
                <>
                  <CheckCircle size={17} />
                  Submit Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
}

export default FacultyAttendance;
