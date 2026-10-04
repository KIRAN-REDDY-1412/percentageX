import { useState } from "react";
import { Plus, CheckCircle, X, School } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function AdminCourses() {
  const { courses, addCourse } = useCollege();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    fullName: "",
    department: "Computer Science & Engineering",
    duration: "4 Years",
    years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    sections: {
      "1st Year": ["Section A", "Section B"],
      "2nd Year": ["Section A", "Section B"],
      "3rd Year": ["Section A"],
      "4th Year": ["Section A"],
    },
  });

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!newCourse.name.trim() || !newCourse.code.trim()) {
      showToast("Please fill in course name and code.", "warning");
      return;
    }
    addCourse({
      ...newCourse,
      id: `course-${newCourse.code.toLowerCase()}`,
    });
    showToast(`Program "${newCourse.name}" registered successfully!`, "success");
    setShowAddModal(false);
    setNewCourse({
      code: "",
      name: "",
      fullName: "",
      department: "Computer Science & Engineering",
      duration: "4 Years",
      years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      sections: {
        "1st Year": ["Section A", "Section B"],
        "2nd Year": ["Section A"],
      },
    });
  };

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Academic Programs</p>
            <h1>Course & Department Management</h1>
            <p className="page-description">
              Manage degrees, academic streams, duration, and curriculum structures.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add New Degree / Course</span>
          </button>
        </div>

        {/* COURSES LIST */}
        {courses.length === 0 ? (
          <div className="card-box" style={{ textAlign: "center", padding: "48px 24px" }}>
            <School size={40} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No Academic Programs Configured Yet</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "14px" }}>
              Get started by adding your institution's degrees, branches, or academic streams.
            </p>
            <button className="primary-button" onClick={() => setShowAddModal(true)} style={{ margin: "0 auto" }}>
              <Plus size={16} />
              <span>Add First Degree / Course</span>
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
            <div className="admin-course-card" key={course.id}>
              <div className="course-card-top">
                <div className="course-icon-box">
                  <School size={22} />
                </div>
                <div>
                  <div className="course-badge">{course.code}</div>
                  <h2>{course.name}</h2>
                  <p>{course.fullName}</p>
                </div>
              </div>

              <div className="course-details-box">
                <div className="detail-row">
                  <span>Department:</span>
                  <strong>{course.department}</strong>
                </div>
                <div className="detail-row">
                  <span>Program Duration:</span>
                  <strong>{course.duration}</strong>
                </div>
                <div className="detail-row">
                  <span>Academic Years:</span>
                  <div className="years-pills-list">
                    {course.years.map((y, i) => (
                      <span key={i} className="year-pill">
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="course-sections-preview">
                <h4>Configured Sections</h4>
                <div className="section-breakdown-list">
                  {Object.entries(course.sections || {}).map(([yr, secs]) => (
                    <div key={yr} className="sec-breakdown-row">
                      <strong>{yr}:</strong>
                      <span>{secs.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ADD COURSE MODAL */}
        {showAddModal && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setShowAddModal(false)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Add Academic Program / Degree</h3>
                  <p>Configure course details, duration, and affiliated department</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="modal-form-body">
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Course Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT, MECH, BBA"
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech - IT"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Program Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor of Technology in Information Technology"
                    value={newCourse.fullName}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={newCourse.department}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <select
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, duration: e.target.value })
                      }
                    >
                      <option value="4 Years">4 Years</option>
                      <option value="3 Years">3 Years</option>
                      <option value="2 Years">2 Years</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>Create Course</span>
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

export default AdminCourses;
