import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FacultyLayout from "../../layouts/FacultyLayout";
import {
  getScheduleForDay,
  formatDateYMD,
} from "../../services/timetableService";

/* =========================================
   DATE HELPERS (TIMEZONE-SAFE)
========================================= */

function getDayName(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getMonthName(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
  });
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================================
   COMPONENT
========================================= */

function FacultySchedule() {
  const navigate = useNavigate();

  /* Starting date: 1 October 2026 (noon avoids any DST/timezone rollover) */
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(2026, 9, 1, 12, 0, 0)
  );

  /* Previous day */
  const goPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  /* Next day */
  const goNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  /* Previous / next date calculations */
  const previousDate = new Date(selectedDate);
  previousDate.setDate(selectedDate.getDate() - 1);

  const nextDate = new Date(selectedDate);
  nextDate.setDate(selectedDate.getDate() + 1);

  /* Selected weekday */
  const dayName = getDayName(selectedDate);

  /* Get classes for selected weekday from single source of truth */
  const classes = getScheduleForDay(dayName);

  return (
    <FacultyLayout>
      <div className="schedule-page">
        {/* TOP */}
        <div className="schedule-top">
          <div>
            <p className="breadcrumb">
              Faculty / Schedule
            </p>

            <h1>
              Class Schedule / Timetable
            </h1>
          </div>

          <button className="month-button">
            <CalendarDays size={17} />
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </button>
        </div>

        {/* DATE NAVIGATION */}
        <div className="date-navigation">
          {/* PREVIOUS BUTTON */}
          <button
            className="date-arrow"
            onClick={goPreviousDay}
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>

          {/* PREVIOUS DATE */}
          <div
            className="date-card"
            onClick={goPreviousDay}
          >
            <span>{previousDate.getDate()}</span>
            <small>{getMonthName(previousDate)}</small>
            <label>Previous</label>
          </div>

          {/* CURRENT DATE */}
          <div className="date-card selected-date">
            <span>{selectedDate.getDate()}</span>
            <small>{getMonthName(selectedDate)}</small>
            <label>Selected</label>
          </div>

          {/* NEXT DATE */}
          <div
            className="date-card"
            onClick={goNextDay}
          >
            <span>{nextDate.getDate()}</span>
            <small>{getMonthName(nextDate)}</small>
            <label>Next</label>
          </div>

          {/* NEXT BUTTON */}
          <button
            className="date-arrow"
            onClick={goNextDay}
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* SELECTED DAY */}
        <div className="selected-day">
          <h2>{formatDate(selectedDate)}</h2>
        </div>

        {/* CLASS LIST */}
        <div className="class-list">
          {classes.length === 0 ? (
            <div className="no-classes">
              <CalendarDays size={30} />
              <h3>No Classes Scheduled</h3>
              <p>
                There are no classes assigned to you on this day.
              </p>
            </div>
          ) : (
            classes.map((item, index) => (
              <div
                className={`class-row ${item.type}`}
                key={`${item.classId}-${item.time}-${index}`}
              >
                {/* COLOR */}
                <div className="class-color"></div>

                {/* CLASS INFORMATION */}
                <div className="class-info">
                  <h3>{item.subject}</h3>
                  <p>
                    {item.course}&nbsp;•&nbsp;{item.year}&nbsp;•&nbsp;{item.section}
                  </p>
                </div>

                {/* TIME */}
                <div className="class-period">
                  <span>{item.time}</span>
                  <small>{item.period}</small>
                </div>

                {/* OPEN ATTENDANCE */}
                <button
                  className="class-open-button"
                  onClick={() =>
                    navigate("/faculty/attendance", {
                      state: {
                        classData: item,
                        selectedDate: formatDateYMD(selectedDate),
                        selectedDay: dayName,
                      },
                    })
                  }
                >
                  Open
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}

export default FacultySchedule;