import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Pencil,
  Trash2,
  ClipboardList,
} from "lucide-react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { useToast } from "../../context/ToastContext";
import StatCounter from "../../components/common/StatCounter";

function FacultyAssignments() {
  const location = useLocation();
  const incomingClass = location.state?.classData;

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "SQL Queries Practice",
      subject: "Database Management Systems",
      className: "B.Tech - CSE • 2nd Year • Section A",
      dueDate: "05 October 2026",
      totalMarks: 10,
      description:
        "Write SQL queries using SELECT, WHERE, GROUP BY and JOIN.",
    },
    {
      id: 2,
      title: "Operating System Process Management",
      subject: "Operating Systems",
      className: "B.Tech - CSE • 3rd Year • Section A",
      dueDate: "08 October 2026",
      totalMarks: 10,
      description:
        "Prepare notes on process states, scheduling and context switching.",
    },
  ]);

  const [showForm, setShowForm] = useState(Boolean(incomingClass));

  const [formData, setFormData] = useState({
    title: "",
    subject: incomingClass?.subject || "Database Management Systems",
    className: incomingClass
      ? `${incomingClass.course} • ${incomingClass.year} • ${incomingClass.section}`
      : "B.Tech - CSE • 2nd Year • Section A",
    dueDate: "",
    totalMarks: "10",
    description: "",
  });

  const { showToast } = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreate = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter assignment title.", "warning");
      return;
    }

    if (!formData.dueDate) {
      showToast("Please select a due date.", "warning");
      return;
    }

    const newAssignment = {
      id: Date.now(),
      ...formData,
      totalMarks: Number(formData.totalMarks),
      dueDate: new Date(
        formData.dueDate
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    setAssignments((previous) => [
      ...previous,
      newAssignment,
    ]);

    showToast(`Assignment "${formData.title}" created successfully!`, "success");

    setFormData({
      title: "",
      subject: "Database Management Systems",
      className: "B.Tech - CSE • 2nd Year • Section A",
      dueDate: "",
      totalMarks: "10",
      description: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setAssignments((previous) =>
      previous.filter(
        (assignment) => assignment.id !== id
      )
    );
    showToast("Assignment removed successfully.", "info");
  };

  return (
    <FacultyLayout>

      <div className="assignments-page">

        {/* HEADER */}

        <div className="assignments-header">

          <div className="assignments-title">

            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <p className="breadcrumb">
                Faculty / Assignments
              </p>

              <h1>Assignments</h1>

              <p className="assignments-subtitle">
                Create and manage assignments for your classes
              </p>
            </div>

          </div>

          <button
            className="create-assignment-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={17} />
            Create Assignment
          </button>

        </div>


        {/* CREATE FORM */}

        {showForm && (

          <div className="assignment-form-card">

            <div className="assignment-form-header">

              <div>
                <h2>Create Assignment</h2>

                <p>
                  Add an assignment for your selected class.
                </p>
              </div>

              <button
                className="form-close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleCreate}>

              <div className="assignment-form-grid">

                <div className="assignment-field full-width">

                  <label>
                    Assignment Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter assignment title"
                  />

                </div>


                <div className="assignment-field">

                  <label>
                    Class
                  </label>

                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                  >
                    <option>
                      B.Tech - CSE • 2nd Year • Section A
                    </option>

                    <option>
                      B.Tech - CSE • 2nd Year • Section B
                    </option>

                    <option>
                      B.Tech - CSE • 3rd Year • Section A
                    </option>

                    <option>
                      B.Sc - MPC • 2nd Year • Section B
                    </option>
                  </select>

                </div>


                <div className="assignment-field">

                  <label>
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option>
                      Database Management Systems
                    </option>

                    <option>
                      Operating Systems
                    </option>

                    <option>
                      Computer Networks
                    </option>

                    <option>
                      Programming in Java
                    </option>
                  </select>

                </div>


                <div className="assignment-field">

                  <label>
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />

                </div>


                <div className="assignment-field">

                  <label>
                    Total Marks
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    min="1"
                    max="100"
                    value={formData.totalMarks}
                    onChange={handleChange}
                  />

                </div>


                <div className="assignment-field full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter assignment instructions..."
                    rows="4"
                  />

                </div>

              </div>


              <div className="assignment-form-footer">

                <button
                  type="button"
                  className="cancel-assignment-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-assignment-button"
                >
                  Create Assignment
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ASSIGNMENT LIST */}

        <div className="assignment-list-card">

          <div className="assignment-list-header">

            <div>
              <h2>My Assignments</h2>

              <p>
                Assignments created for your classes
              </p>
            </div>

            <span className="assignment-count">
              <StatCounter value={assignments.length} /> Assignments
            </span>

          </div>


          <div className="assignment-list">

            {assignments.map((assignment) => (

              <div
                className="assignment-item"
                key={assignment.id}
              >

                <div className="assignment-icon">
                  <ClipboardList size={20} />
                </div>


                <div className="assignment-main">

                  <h3>
                    {assignment.title}
                  </h3>

                  <p className="assignment-subject">
                    {assignment.subject}
                  </p>

                  <p className="assignment-description">
                    {assignment.description}
                  </p>

                  <span className="assignment-class">
                    {assignment.className}
                  </span>

                </div>


                <div className="assignment-details">

                  <div className="assignment-due">

                    <CalendarDays size={15} />

                    <div>
                      <span>Due Date</span>
                      <strong>
                        {assignment.dueDate}
                      </strong>
                    </div>

                  </div>


                  <div className="assignment-marks">

                    <span>Marks</span>

                    <strong>
                      {assignment.totalMarks}
                    </strong>

                  </div>

                </div>


                <div className="assignment-actions">

                  <button
                    className="edit-assignment-button"
                    onClick={() =>
                      showToast(
                        "Editing active: adjust title or deadline above.",
                        "info"
                      )
                    }
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-assignment-button"
                    onClick={() =>
                      handleDelete(assignment.id)
                    }
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </FacultyLayout>
  );
}

export default FacultyAssignments;