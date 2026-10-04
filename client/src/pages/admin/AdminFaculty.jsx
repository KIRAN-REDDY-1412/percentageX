import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  X,
  CheckCircle,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function AdminFaculty() {
  const { facultyMembers, addFaculty, editFaculty, deleteFaculty } =
    useCollege();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [viewingFaculty, setViewingFaculty] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    experience: "3 Years",
    subjects: [],
  });

  const filteredFaculty = facultyMembers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || f.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      experience: "3 Years",
      subjects: [],
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      email: faculty.email,
      phone: faculty.phone,
      department: faculty.department,
      designation: faculty.designation,
      experience: faculty.experience || "5 Years",
      subjects: faculty.subjects || [],
    });
  };

  const handleSaveFaculty = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Please fill in required fields (Name and Email).", "warning");
      return;
    }

    if (editingFaculty) {
      editFaculty(editingFaculty.id, formData);
      setEditingFaculty(null);
      showToast(`Faculty profile for "${formData.name}" updated successfully!`, "success");
    } else {
      addFaculty(formData);
      setShowAddModal(false);
      showToast(`Faculty member "${formData.name}" onboarded successfully!`, "success");
    }
  };

  const handleDelete = (id, name) => {
    deleteFaculty(id);
    showToast(`Faculty member ${name} deactivated.`, "info");
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Faculty Management</p>
            <h1>Faculty Directory & Management</h1>
            <p className="page-description">
              Manage faculty credentials, departments, and course assignments.
            </p>
          </div>

          <button className="primary-button" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add New Faculty</span>
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search faculty by name, ID or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-select-wrapper">
            <Filter size={16} />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Computer Science & Engineering">
                Computer Science & Engineering
              </option>
              <option value="Electronics & Communication Engineering">
                Electronics & Communication Engineering
              </option>
              <option value="Sciences & Mathematics">Sciences & Mathematics</option>
            </select>
          </div>
        </div>

        {/* FACULTY CARDS GRID */}
        <div className="faculty-grid">
          {filteredFaculty.length === 0 ? (
            <div className="empty-state-card">
              <Users size={32} />
              <h3>No Faculty Members Found</h3>
              <p>Try adjusting your search criteria or add a new faculty member.</p>
            </div>
          ) : (
            filteredFaculty.map((faculty) => (
              <div className="admin-faculty-card" key={faculty.id}>
                <div className="faculty-card-top">
                  <div className="faculty-avatar-circle">
                    {faculty.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="faculty-card-main-info">
                    <div className="faculty-title-row">
                      <h3>{faculty.name}</h3>
                      <span className="status-badge active">
                        {faculty.status || "Active"}
                      </span>
                    </div>
                    <span className="faculty-designation">
                      {faculty.designation} • {faculty.department}
                    </span>
                    <span className="faculty-id-tag">ID: {faculty.id}</span>
                  </div>
                </div>

                <div className="faculty-contact-details">
                  <div className="contact-row">
                    <Mail size={14} />
                    <span>{faculty.email}</span>
                  </div>
                  <div className="contact-row">
                    <Phone size={14} />
                    <span>{faculty.phone || "+91 98000 00000"}</span>
                  </div>
                </div>

                <div className="faculty-subjects-section">
                  <span className="section-small-title">
                    <BookOpen size={13} />
                    <span>Assigned Subjects</span>
                  </span>
                  <div className="subject-tags-list">
                    {(faculty.subjects || []).length > 0 ? (
                      faculty.subjects.map((sub, i) => (
                        <span className="sub-tag" key={i}>
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-sm">No subjects assigned yet</span>
                    )}
                  </div>
                </div>

                <div className="faculty-card-actions">
                  <button
                    className="action-icon-btn edit"
                    onClick={() => handleOpenEdit(faculty)}
                    title="Edit Faculty"
                  >
                    <Edit size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="action-icon-btn delete"
                    onClick={() => handleDelete(faculty.id, faculty.name)}
                    title="Delete Faculty"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                  <button
                    className="action-icon-btn view"
                    onClick={() => setViewingFaculty(faculty)}
                  >
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD / EDIT MODAL */}
        {(showAddModal || editingFaculty) && (
          <div
            className="slot-modal-backdrop"
            onClick={() => {
              setShowAddModal(false);
              setEditingFaculty(null);
            }}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>
                    {editingFaculty ? "Edit Faculty Details" : "Add New Faculty Member"}
                  </h3>
                  <p>Provide contact information, department, and designations</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFaculty(null);
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveFaculty} className="modal-form-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Arvind Swamy"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. arvind.cse@percentagex.edu"
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
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    >
                      <option value="Computer Science & Engineering">
                        Computer Science & Engineering
                      </option>
                      <option value="Electronics & Communication Engineering">
                        Electronics & Communication Engineering
                      </option>
                      <option value="Sciences & Mathematics">
                        Sciences & Mathematics
                      </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <select
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({ ...formData, designation: e.target.value })
                      }
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">
                        Associate Professor
                      </option>
                      <option value="Assistant Professor">
                        Assistant Professor
                      </option>
                      <option value="Lecturer">Lecturer</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingFaculty(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>
                      {editingFaculty ? "Save Changes" : "Create Faculty"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {viewingFaculty && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setViewingFaculty(null)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>{viewingFaculty.name}</h3>
                  <p>
                    {viewingFaculty.designation} • {viewingFaculty.department}
                  </p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setViewingFaculty(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-details-body">
                <div className="detail-item-row">
                  <span>Faculty ID:</span>
                  <strong>{viewingFaculty.id}</strong>
                </div>
                <div className="detail-item-row">
                  <span>Official Email:</span>
                  <strong>{viewingFaculty.email}</strong>
                </div>
                <div className="detail-item-row">
                  <span>Phone Number:</span>
                  <strong>{viewingFaculty.phone}</strong>
                </div>
                <div className="detail-item-row">
                  <span>Experience:</span>
                  <strong>{viewingFaculty.experience || "7 Years"}</strong>
                </div>
                <div className="detail-item-row">
                  <span>Status:</span>
                  <span className="status-badge active">
                    {viewingFaculty.status || "Active"}
                  </span>
                </div>

                <div className="details-section-box">
                  <h4>Assigned Classes & Sections</h4>
                  {(viewingFaculty.assignedSections || []).length > 0 ? (
                    <ul className="details-list">
                      {viewingFaculty.assignedSections.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-sm">No sections assigned currently</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AdminFaculty;
