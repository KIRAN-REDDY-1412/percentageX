import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function AdminTimetable() {
  const {
    assignments,
    addAssignment,
    editAssignment,
    deleteAssignment,
    facultyMembers,
    subjects,
  } = useCollege();

  // Modal to create brand new subject/class assignment
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);

  // Modal to add a schedule slot to an existing assignment
  const [addingSlotToClass, setAddingSlotToClass] = useState(null);

  // Form for new assignment
  const [newAssignmentData, setNewAssignmentData] = useState({
    facultyName: facultyMembers[0]?.name || "",
    facultyId: facultyMembers[0]?.id || "",
    subject: subjects[0]?.name || "",
    course: "B.Tech - CSE",
    year: "1st Year",
    section: "Section A",
    room: "Room 101",
    studentsCount: 40,
    type: "blue",
    initialDay: "Monday",
    initialTime: "09:00 AM - 10:00 AM",
    initialPeriod: "Period 1",
  });

  // Form for adding a new slot
  const [slotData, setSlotData] = useState({
    day: "Wednesday",
    time: "03:00 PM - 04:00 PM",
    period: "Period 4",
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const faculty = facultyMembers.find(
      (f) => f.name === newAssignmentData.facultyName
    );

    addAssignment({
      facultyId: faculty ? faculty.id : "FAC204",
      facultyName: newAssignmentData.facultyName,
      subject: newAssignmentData.subject,
      course: newAssignmentData.course,
      year: newAssignmentData.year,
      section: newAssignmentData.section,
      room: newAssignmentData.room,
      studentsCount: Number(newAssignmentData.studentsCount) || 40,
      type: newAssignmentData.type || "blue",
      schedule: [
        {
          day: newAssignmentData.initialDay,
          time: newAssignmentData.initialTime,
          period: newAssignmentData.initialPeriod,
        },
      ],
    });

    setShowNewAssignmentModal(false);
  };

  const handleAddSlotToClass = (e) => {
    e.preventDefault();
    if (!addingSlotToClass) return;

    const updatedSchedule = [
      ...addingSlotToClass.schedule,
      {
        day: slotData.day,
        time: slotData.time,
        period: slotData.period,
      },
    ];

    editAssignment(addingSlotToClass.id, { schedule: updatedSchedule });
    setAddingSlotToClass(null);
  };

  const handleDeleteSlot = (classItem, slotIndex) => {
    if (classItem.schedule.length <= 1) {
      if (
        window.confirm(
          "This is the only slot for this class. Deleting it will remove the entire assignment. Proceed?"
        )
      ) {
        deleteAssignment(classItem.id);
      }
      return;
    }

    const updatedSchedule = classItem.schedule.filter((_, idx) => idx !== slotIndex);
    editAssignment(classItem.id, { schedule: updatedSchedule });
  };

  const handleDeleteAssignment = (classId, subject, section) => {
    if (
      window.confirm(
        `Are you sure you want to completely delete assignment for ${subject} (${section})?`
      )
    ) {
      deleteAssignment(classId);
    }
  };

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Timetable Architecture</p>
            <h1>Faculty Assignment & Timetable Management</h1>
            <p className="page-description">
              Assign faculty to courses, sections, and schedule weekly class slots.
              All changes automatically update View Schedule, My Classes, and Attendance.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowNewAssignmentModal(true)}
          >
            <Plus size={16} />
            <span>Create New Assignment</span>
          </button>
        </div>

        {/* NOTICE BOX */}
        <div className="admin-info-banner">
          <AlertCircle size={20} className="info-icon" />
          <div>
            <strong>Single Source of Truth Timetable Engine</strong>
            <p>
              Faculty members see assignments in <em>My Classes</em>, daily classes in{" "}
              <em>View Schedule</em>, and mark sessions in <em>Attendance</em> based on these records.
            </p>
          </div>
        </div>

        {/* ASSIGNMENTS GRID */}
        {assignments.length === 0 ? (
          <div className="card-box" style={{ textAlign: "center", padding: "48px 24px" }}>
            <CalendarDays size={40} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No Class Timetable Assignments Created Yet</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "14px" }}>
              Assign faculty members to subjects, courses, and class sections to generate the master timetable.
            </p>
            <button className="primary-button" onClick={() => setShowNewAssignmentModal(true)} style={{ margin: "0 auto" }}>
              <Plus size={16} />
              <span>Create First Assignment</span>
            </button>
          </div>
        ) : (
          <div className="my-classes-grid">
            {assignments.map((item) => (
            <div className={`my-class-card ${item.type || "blue"}`} key={item.id}>
              {/* CARD TITLE */}
              <div className="my-class-title">
                <div className="my-class-icon">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2>{item.subject}</h2>
                  <p>{item.course}</p>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="my-class-details">
                <div>
                  <span>Assigned Faculty</span>
                  <strong>{item.facultyName || "Prof. Rajesh Kumar"}</strong>
                </div>
                <div>
                  <span>Class & Year</span>
                  <strong>
                    {item.year} • {item.section}
                  </strong>
                </div>
                <div>
                  <span>Classroom</span>
                  <strong>{item.room || "Room 204"}</strong>
                </div>
              </div>

              {/* SCHEDULE SLOTS LIST */}
              <div className="class-schedule-box">
                <div className="schedule-heading-with-btn">
                  <div className="schedule-heading">
                    <CalendarDays size={17} />
                    <span>Weekly Schedule Slots ({item.schedule?.length || 0})</span>
                  </div>
                  <button
                    type="button"
                    className="add-slot-badge-btn"
                    onClick={() => setAddingSlotToClass(item)}
                  >
                    <Plus size={13} />
                    <span>Add Slot</span>
                  </button>
                </div>

                <div className="weekly-schedule-list">
                  {item.schedule?.map((slot, sIdx) => (
                    <div className="weekly-schedule-row" key={sIdx}>
                      <div className="schedule-row-left">
                        <strong>{slot.day}</strong>
                        <span>
                          {slot.time} ({slot.period || `Slot ${sIdx + 1}`})
                        </span>
                      </div>

                      <button
                        type="button"
                        className="delete-slot-btn"
                        onClick={() => handleDeleteSlot(item, sIdx)}
                        title="Delete this schedule slot"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="admin-card-footer">
                <button
                  type="button"
                  className="delete-assignment-full-btn"
                  onClick={() =>
                    handleDeleteAssignment(item.id, item.subject, item.section)
                  }
                >
                  <Trash2 size={14} />
                  <span>Remove Entire Assignment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* MODAL: CREATE NEW ASSIGNMENT */}
        {showNewAssignmentModal && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setShowNewAssignmentModal(false)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Create Faculty Class Assignment</h3>
                  <p>Assign a subject and section to a faculty member</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setShowNewAssignmentModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="modal-form-body">
                <div className="form-group">
                  <label>Assign Faculty Member *</label>
                  <select
                    value={newAssignmentData.facultyName}
                    onChange={(e) =>
                      setNewAssignmentData({
                        ...newAssignmentData,
                        facultyName: e.target.value,
                      })
                    }
                  >
                    {facultyMembers.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    value={newAssignmentData.subject}
                    onChange={(e) =>
                      setNewAssignmentData({
                        ...newAssignmentData,
                        subject: e.target.value,
                      })
                    }
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>Course</label>
                    <select
                      value={newAssignmentData.course}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          course: e.target.value,
                        })
                      }
                    >
                      <option value="B.Tech - CSE">B.Tech - CSE</option>
                      <option value="B.Tech - ECE">B.Tech - ECE</option>
                      <option value="B.Sc - MPC">B.Sc - MPC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      value={newAssignmentData.year}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          year: e.target.value,
                        })
                      }
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={newAssignmentData.section}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          section: e.target.value,
                        })
                      }
                    >
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>First Class Day</label>
                    <select
                      value={newAssignmentData.initialDay}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          initialDay: e.target.value,
                        })
                      }
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time Slot</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM - 10:00 AM"
                      value={newAssignmentData.initialTime}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          initialTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Period Label</label>
                    <input
                      type="text"
                      placeholder="Period 1"
                      value={newAssignmentData.initialPeriod}
                      onChange={(e) =>
                        setNewAssignmentData({
                          ...newAssignmentData,
                          initialPeriod: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setShowNewAssignmentModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>Save Assignment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD SCHEDULE SLOT TO EXISTING CLASS */}
        {addingSlotToClass && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setAddingSlotToClass(null)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Add Weekly Schedule Slot</h3>
                  <p>
                    {addingSlotToClass.subject} • {addingSlotToClass.year} (
                    {addingSlotToClass.section})
                  </p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setAddingSlotToClass(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSlotToClass} className="modal-form-body">
                <div className="form-group">
                  <label>Day of the Week</label>
                  <select
                    value={slotData.day}
                    onChange={(e) =>
                      setSlotData({ ...slotData, day: e.target.value })
                    }
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Time Slot *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 03:00 PM - 04:00 PM"
                      value={slotData.time}
                      onChange={(e) =>
                        setSlotData({ ...slotData, time: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Period Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Period 4"
                      value={slotData.period}
                      onChange={(e) =>
                        setSlotData({ ...slotData, period: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setAddingSlotToClass(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>Add Slot to Schedule</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AdminTimetable;
