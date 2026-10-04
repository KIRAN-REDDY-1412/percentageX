import { useState } from "react";
import { CalendarDays } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { getScheduleForSection } from "../../services/timetableService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function StudentSchedule() {
  const { currentUser, verifiedStudentData } = useCollege();
  const [selectedDay, setSelectedDay] = useState("Thursday");

  const student =
    verifiedStudentData?.student ||
    (currentUser?.course
      ? currentUser
      : {
          rollNumber: "2301",
          name: "Rahul Varma",
          course: "B.Tech - CSE",
          year: "2nd Year",
          section: "Section A",
        });

  // Timetable strictly for this student's assigned section
  const dayClasses = getScheduleForSection(
    student.course,
    student.year,
    student.section,
    selectedDay
  );

  return (
    <AppLayout>
      <div className="student-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Student / Schedule</p>
            <h1>My Section Timetable</h1>
            <p className="page-description">
              Class schedule for {student.course} • {student.year} ({student.section})
            </p>
          </div>
        </div>

        {/* DAY SELECTOR TABS */}
        <div className="schedule-day-tabs">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              className={`day-tab-btn ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              <span>{day}</span>
            </button>
          ))}
        </div>

        {/* CLASS TIMETABLE CARDS */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>{selectedDay}'s Classes ({dayClasses.length})</h2>
              <p>Lecture periods for {student.year} {student.section}</p>
            </div>
          </div>

          <div className="class-list">
            {dayClasses.length === 0 ? (
              <div className="no-classes">
                <CalendarDays size={30} />
                <h3>No Classes on {selectedDay}</h3>
                <p>Enjoy your study break or prepare for upcoming laboratory sessions.</p>
              </div>
            ) : (
              dayClasses.map((item, idx) => (
                <div className={`class-row ${item.type || "blue"}`} key={idx}>
                  <div className="class-color"></div>

                  <div className="class-info">
                    <h3>{item.subject}</h3>
                    <p>
                      {item.facultyName} • {item.room || "Room 204"}
                    </p>
                  </div>

                  <div className="class-period">
                    <span>{item.time}</span>
                    <small>{item.period || `Period ${idx + 1}`}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default StudentSchedule;
