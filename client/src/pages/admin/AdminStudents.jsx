import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function AdminStudents() {
  const { students, addStudent, editStudent, deleteStudent, courses } =
    useCollege();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    phone: "",
    course: "B.Tech - CSE",
    year: "2nd Year",
    section: "Unassigned",
    attendancePercentage: 0,
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      courseFilter === "all" || s.course === courseFilter;
    const matchesYear = yearFilter === "all" || s.year === yearFilter;
    const matchesSection =
      sectionFilter === "all"
        ? true
        : sectionFilter === "Unassigned"
        ? !s.section || s.section === "Unassigned" || s.section === "Not Assigned"
        : s.section === sectionFilter;

    return matchesSearch && matchesCourse && matchesYear && matchesSection;
  });

  const handleOpenAdd = () => {
    setFormData({
      rollNumber: String(2300 + students.length + 1),
      name: "",
      email: "",
      phone: "",
      course: courses?.[0]?.name || "B.Tech - CSE",
      year: "2nd Year",
      section: "Unassigned",
      attendancePercentage: 0,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      course: student.course,
      year: student.year,
      section: student.section || "Unassigned",
      attendancePercentage: student.attendancePercentage ?? 0,
    });
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      showToast("Please fill in Student Name and Roll Number.", "warning");
      return;
    }

    if (editingStudent) {
      editStudent(editingStudent.id, formData);
      setEditingStudent(null);
      showToast(`Student record for ${formData.name} (${formData.rollNumber}) updated!`, "success");
    } else {
      addStudent(formData);
      setShowAddModal(false);
      showToast(`Student ${formData.name} (Roll: ${formData.rollNumber}) enrolled successfully!`, "success");
    }
  };

  const handleDelete = (id, roll) => {
    deleteStudent(id);
    showToast(`Student Roll No ${roll} removed from registry.`, "info");
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Student Management</p>
            <h1>Student Directory & Enrollment</h1>
            <p className="page-description">
              Manage student enrollment, section allocations, and academic records.
            </p>
          </div>

          <button className="primary-button" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Enroll New Student</span>
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="multi-filters-group">
            <div className="filter-select-wrapper">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="B.Tech - CSE">B.Tech - CSE</option>
                <option value="B.Tech - ECE">B.Tech - ECE</option>
                <option value="B.Sc - MPC">B.Sc - MPC</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="all">All Sections</option>
                <option value="Unassigned">Not Assigned</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE CARD */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Enrolled Students ({filteredStudents.length})</h2>
              <p>Active students registered in college sections</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Course & Year</th>
                  <th>Section</th>
                  <th>Contact Info</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-table-cell">
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <span className="roll-badge">{student.rollNumber}</span>
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>
                        {student.course} • {student.year}
                      </td>
                      <td>
                        {student.section &&
                        student.section !== "Unassigned" &&
                        student.section !== "Not Assigned" ? (
                          <span className="section-pill">{student.section}</span>
                        ) : (
                          <span className="section-pill unassigned">Not Assigned</span>
                        )}
                      </td>
                      <td>
                        <div className="contact-cell">
                          <small>{student.email}</small>
                          <small className="text-muted">{student.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`attendance-pill ${
                            (student.attendancePercentage ?? 0) >= 85
                              ? "high"
                              : (student.attendancePercentage ?? 0) >= 75
                              ? "medium"
                              : (student.attendancePercentage ?? 0) > 0
                              ? "low"
                              : "neutral"
                          }`}
                        >
                          {student.attendancePercentage ?? 0}%
                        </span>
                      </td>
                      <td>
                        <span className="status-badge active">
                          {student.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            className="icon-action-btn"
                            onClick={() => handleOpenEdit(student)}
                            title="Edit Student"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="icon-action-btn delete"
                            onClick={() =>
                              handleDelete(student.id, student.rollNumber)
                            }
                            title="Delete Student"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD / EDIT STUDENT MODAL */}
        {(showAddModal || editingStudent) && (
          <div
            className="slot-modal-backdrop"
            onClick={() => {
              setShowAddModal(false);
              setEditingStudent(null);
            }}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>
                    {editingStudent ? "Edit Student Details" : "Enroll New Student"}
                  </h3>
                  <p>Register student under appropriate course, year, and section</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveStudent} className="modal-form-body">
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Roll Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2341"
                      value={formData.rollNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Rao"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="student@percentagex.edu"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98000 00000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>Course</label>
                    <select
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                    >
                      {(courses && courses.length > 0
                        ? courses.map((c) => c.name)
                        : ["B.Tech - CSE", "B.Tech - ECE", "B.Sc - MPC"]
                      ).map((cName) => (
                        <option key={cName} value={cName}>
                          {cName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
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
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                    >
                      <option value="Unassigned">Not Assigned (Unassigned)</option>
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                      <option value="Section C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingStudent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>
                      {editingStudent ? "Save Changes" : "Enroll Student"}
                    </span>
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

export default AdminStudents;
