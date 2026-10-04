import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  ClipboardList,
  ChevronRight,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import FacultyLayout from "../../layouts/FacultyLayout";
import {
  getAssignedClasses,
  formatDateYMD,
  getDateForWeekday,
} from "../../services/timetableService";

function MyClasses() {
  const navigate = useNavigate();
  const myClasses = getAssignedClasses();

  // For modal slot selection when clicking footer Attendance button
  const [selectedClassForSlotModal, setSelectedClassForSlotModal] =
    useState(null);

  const totalWeeklyClasses = myClasses.reduce(
    (total, classItem) => total + classItem.schedule.length,
    0
  );

  const totalStudents = myClasses.reduce(
    (total, classItem) => total + classItem.students,
    0
  );

  const totalSubjects = new Set(
    myClasses.map((item) => item.subject)
  ).size;

  /**
   * Opens attendance for a specific schedule slot of a class.
   * Computes the exact matching weekday date so Date and Day stay consistent.
   */
  const handleOpenAttendanceForSlot = (classItem, scheduleSlot) => {
    const baseDate = new Date(2026, 9, 1, 12, 0, 0);
    const targetDate = getDateForWeekday(baseDate, scheduleSlot.day);

    navigate("/faculty/attendance", {
      state: {
        classData: {
          subject: classItem.subject,
          course: classItem.course,
          year: classItem.year,
          section: classItem.section,
          students: classItem.students,
          room: classItem.room,
          time: scheduleSlot.time,
          period: scheduleSlot.period,
          day: scheduleSlot.day,
        },
        selectedDate: formatDateYMD(targetDate),
        selectedDay: scheduleSlot.day,
      },
    });
  };

  /**
   * Card footer Attendance button handler.
   * If there's 1 slot, opens it directly.
   * If multiple slots, opens the modal to let faculty choose which day/time slot.
   */
  const handleCardAttendanceClick = (classItem) => {
    if (classItem.schedule.length === 1) {
      handleOpenAttendanceForSlot(classItem, classItem.schedule[0]);
    } else {
      setSelectedClassForSlotModal(classItem);
    }
  };

  return (
    <FacultyLayout>
      <div className="my-classes-page">
        {/* HEADER */}
        <div className="my-classes-header">
          <div>
            <p className="breadcrumb">
              Faculty / My Classes
            </p>

            <h1>My Classes</h1>

            <p className="page-description">
              All classes and sections assigned to you
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="my-classes-summary">
          <div className="summary-card">
            <div className="summary-icon blue">
              <BookOpen size={22} />
            </div>

            <div>
              <span>Assigned Classes</span>
              <strong>{myClasses.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon green">
              <CalendarDays size={22} />
            </div>

            <div>
              <span>Weekly Classes</span>
              <strong>{totalWeeklyClasses}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon purple">
              <BookOpen size={22} />
            </div>

            <div>
              <span>Subjects</span>
              <strong>{totalSubjects}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon orange">
              <ClipboardCheck size={22} />
            </div>

            <div>
              <span>Students</span>
              <strong>{totalStudents}</strong>
            </div>
          </div>
        </div>

        {/* CLASS CARDS */}
        <div className="my-classes-grid">
          {myClasses.map((classItem) => (
            <div
              className={`my-class-card ${classItem.type || "blue"}`}
              key={classItem.id}
            >
              {/* CLASS TITLE */}
              <div className="my-class-title">
                <div className="my-class-icon">
                  <BookOpen size={23} />
                </div>

                <div>
                  <h2>{classItem.subject}</h2>
                  <p>{classItem.course}</p>
                </div>
              </div>

              {/* CLASS DETAILS */}
              <div className="my-class-details">
                <div>
                  <span>Year</span>
                  <strong>{classItem.year}</strong>
                </div>

                <div>
                  <span>Section</span>
                  <strong>{classItem.section}</strong>
                </div>

                <div>
                  <span>Students</span>
                  <strong>{classItem.students}</strong>
                </div>
              </div>

              {/* COMPLETE WEEKLY SCHEDULE */}
              <div className="class-schedule-box">
                <div className="schedule-heading">
                  <CalendarDays size={18} />
                  <span>Weekly Schedule (Tap any slot for Attendance)</span>
                </div>

                <div className="weekly-schedule-list">
                  {classItem.schedule.map((scheduleItem, index) => (
                    <div
                      className="weekly-schedule-row weekly-schedule-row-interactive"
                      key={`${scheduleItem.day}-${scheduleItem.time}-${index}`}
                      onClick={() =>
                        handleOpenAttendanceForSlot(classItem, scheduleItem)
                      }
                      title={`Open Attendance for ${scheduleItem.day} (${scheduleItem.time})`}
                    >
                      <div className="schedule-row-info">
                        <strong>{scheduleItem.day}</strong>
                        <span>{scheduleItem.time}</span>
                      </div>

                      <button
                        type="button"
                        className="slot-attendance-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAttendanceForSlot(classItem, scheduleItem);
                        }}
                      >
                        <ClipboardCheck size={13} />
                        <span>Attendance</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="my-class-actions">
                <button
                  type="button"
                  onClick={() => handleCardAttendanceClick(classItem)}
                  title="Mark Attendance for this class"
                >
                  <ClipboardCheck size={16} />
                  Attendance
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/faculty/internal-marks", {
                      state: { classData: classItem },
                    })
                  }
                >
                  <FileText size={16} />
                  Internal Marks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/faculty/assignments", {
                      state: { classData: classItem },
                    })
                  }
                >
                  <ClipboardList size={16} />
                  Assignments
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL FOR SELECTING SCHEDULE ENTRY IF CLICKING CARD FOOTER ATTENDANCE */}
        {selectedClassForSlotModal && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setSelectedClassForSlotModal(null)}
          >
            <div
              className="slot-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="slot-modal-header">
                <div>
                  <h3>Select Schedule Slot</h3>
                  <p>
                    {selectedClassForSlotModal.subject} •{" "}
                    {selectedClassForSlotModal.year} (
                    {selectedClassForSlotModal.section})
                  </p>
                </div>
                <button
                  type="button"
                  className="slot-modal-close"
                  onClick={() => setSelectedClassForSlotModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="slot-modal-list">
                {selectedClassForSlotModal.schedule.map((slot, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className="slot-modal-item"
                    onClick={() => {
                      const cls = selectedClassForSlotModal;
                      setSelectedClassForSlotModal(null);
                      handleOpenAttendanceForSlot(cls, slot);
                    }}
                  >
                    <div className="slot-modal-item-left">
                      <strong>{slot.day}</strong>
                      <span>{slot.time}</span>
                      <small>{slot.period}</small>
                    </div>
                    <div className="slot-modal-item-right">
                      <span>Mark Attendance</span>
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
}

export default MyClasses;