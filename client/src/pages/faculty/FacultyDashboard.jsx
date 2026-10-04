import { useNavigate } from "react-router-dom";
import FacultyLayout from "../../layouts/FacultyLayout";
import StatCounter from "../../components/common/StatCounter";
import {
  getAssignedClasses,
  getScheduleForDay,
  formatDateYMD,
} from "../../services/timetableService";

function FacultyDashboard() {
  const navigate = useNavigate();

  // Consistent demo reference date: 01 October 2026 (Thursday)
  const todayDate = new Date(2026, 9, 1, 12, 0, 0);
  const todayDayName = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const myClasses = getAssignedClasses();
  const todaysSchedule = getScheduleForDay(todayDayName);

  const totalStudents = myClasses.reduce(
    (total, item) => total + item.students,
    0
  );

  const totalSubjects = new Set(
    myClasses.map((item) => item.subject)
  ).size;

  return (
    <FacultyLayout>
      <div className="page-container-animated">
        <div className="dashboard-header">
          <div>
            <p className="small-heading">Faculty Dashboard</p>

            <h1>Good Morning, Faculty 👋</h1>

            <p className="page-description">
              Here is your schedule and today's academic activities.
            </p>
          </div>

          <div className="date-box">
            <span>Today ({todayDayName})</span>
            <strong>01 October 2026</strong>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Today's Classes</span>
            <strong><StatCounter value={todaysSchedule.length} /></strong>
          </div>

          <div className="stat-card">
            <span>My Classes</span>
            <strong><StatCounter value={myClasses.length} /></strong>
          </div>

          <div className="stat-card">
            <span>My Subjects</span>
            <strong><StatCounter value={totalSubjects} /></strong>
          </div>

          <div className="stat-card">
            <span>Students</span>
            <strong><StatCounter value={totalStudents} /></strong>
          </div>
        </div>

      <section className="schedule-section">
        <div className="section-heading">
          <div>
            <h2>Today's Schedule</h2>

            <p>
              Classes assigned to you for {todayDayName}
            </p>
          </div>

          <button
            className="outline-button"
            onClick={() => navigate("/faculty/schedule")}
          >
            View Full Schedule
          </button>
        </div>

        <div className="schedule-list">
          {todaysSchedule.length === 0 ? (
            <p style={{ color: "#8490a3", padding: "16px 0" }}>
              No classes scheduled for today.
            </p>
          ) : (
            todaysSchedule.map((item, index) => (
              <div className="schedule-card" key={index}>
                <div className="schedule-time">
                  <span>{item.time}</span>
                  <strong>{item.period || `Period ${index + 1}`}</strong>
                </div>

                <div className="schedule-details">
                  <h3>{item.subject}</h3>
                  <p>{item.course}</p>
                  <span>
                    {item.year} • {item.section}
                  </span>
                </div>

                <div className="schedule-room">
                  <span>{item.room || "Room 204"}</span>

                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("/faculty/attendance", {
                        state: {
                          classData: item,
                          selectedDate: formatDateYMD(todayDate),
                          selectedDay: todayDayName,
                        },
                      })
                    }
                  >
                    Open Class
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      </div>
    </FacultyLayout>
  );
}

export default FacultyDashboard;