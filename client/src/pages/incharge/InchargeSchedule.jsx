import { useState } from "react";
import { CalendarDays } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { getScheduleForSection } from "../../services/timetableService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function InchargeSchedule() {
  const [selectedDay, setSelectedDay] = useState("Thursday");

  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  const dayClasses = getScheduleForSection(course, year, section, selectedDay);

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Incharge / Section Timetable</p>
            <h1>Weekly Academic Schedule</h1>
            <p className="page-description">
              Lectures scheduled for {course} • {year} ({section})
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

        {/* CLASS LIST */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>{selectedDay}'s Lecture Timetable ({dayClasses.length})</h2>
              <p>Section classroom: Room 204</p>
            </div>
          </div>

          <div className="class-list">
            {dayClasses.length === 0 ? (
              <div className="no-classes">
                <CalendarDays size={30} />
                <h3>No Classes on {selectedDay}</h3>
                <p>No lectures scheduled for this section today.</p>
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

export default InchargeSchedule;
