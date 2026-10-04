import { useState } from "react";
import { CalendarDays } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { getScheduleForSection } from "../../services/timetableService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function HodSchedule() {
  const [selectedDay, setSelectedDay] = useState("Thursday");
  const [selectedSection, setSelectedSection] = useState("2nd Year - Sec A");

  let course = "B.Tech - CSE";
  let year = "2nd Year";
  let section = "Section A";

  if (selectedSection === "2nd Year - Sec B") {
    year = "2nd Year";
    section = "Section B";
  } else if (selectedSection === "3rd Year - Sec A") {
    year = "3rd Year";
    section = "Section A";
  }

  const dayClasses = getScheduleForSection(course, year, section, selectedDay);

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Timetable</p>
            <h1>CSE Master Academic Schedule</h1>
            <p className="page-description">
              Weekly timetables across Computer Science & Engineering sections.
            </p>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="2nd Year - Sec A">2nd Year (Section A)</option>
              <option value="2nd Year - Sec B">2nd Year (Section B)</option>
              <option value="3rd Year - Sec A">3rd Year (Section A)</option>
            </select>
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
              <h2>
                {selectedDay}'s Classes for {selectedSection} ({dayClasses.length})
              </h2>
              <p>Lecture periods and assigned professors</p>
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

export default HodSchedule;
