import { useState } from "react";
import { Plus, Search, CheckCircle, X } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function AdminSubjects() {
  const { subjects, addSubject } = useCollege();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "Computer Science & Engineering",
    credits: 4,
  });

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please enter subject name and code.", "warning");
      return;
    }
    addSubject(formData);
    showToast(`Subject module "${formData.name}" added successfully!`, "success");
    setShowAddModal(false);
    setFormData({
      code: "",
      name: "",
      department: "Computer Science & Engineering",
      credits: 4,
    });
  };

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Academic Subjects</p>
            <h1>Subject & Curriculum Directory</h1>
            <p className="page-description">
              Manage course subjects, syllabus codes, and credit weighting.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add New Subject</span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by subject name, code, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* SUBJECTS TABLE CARD */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Configured Subjects ({filteredSubjects.length})</h2>
              <p>Subjects eligible for faculty and timetable assignments</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">
                      No subjects found.
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <span className="code-badge">{sub.code}</span>
                      </td>
                      <td>
                        <strong>{sub.name}</strong>
                      </td>
                      <td>{sub.department}</td>
                      <td>
                        <span className="credits-badge">{sub.credits} Credits</span>
                      </td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD SUBJECT MODAL */}
        {showAddModal && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setShowAddModal(false)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Add Subject</h3>
                  <p>Create a new academic subject in the college catalog</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSubject} className="modal-form-body">
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Subject Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS205, AI301"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Credits</label>
                    <select
                      value={formData.credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credits: Number(e.target.value),
                        })
                      }
                    >
                      <option value="4">4 Credits</option>
                      <option value="3">3 Credits</option>
                      <option value="2">2 Credits</option>
                      <option value="1">1 Credit</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence & Machine Learning"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

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
                    <span>Create Subject</span>
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

export default AdminSubjects;
