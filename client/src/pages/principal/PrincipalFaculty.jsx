import { useState } from "react";
import { Search } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function PrincipalFaculty() {
  const { facultyMembers } = useCollege();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = facultyMembers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="principal-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Principal / Faculty Roster</p>
            <h1>College Faculty Directory</h1>
            <p className="page-description">
              Staff roster, academic credentials, and teaching responsibilities.
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="filters-bar-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search faculty by name, department, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="card-box">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Faculty Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Official Contact</th>
                  <th>Assigned Subjects</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span className="code-badge">{f.id}</span>
                    </td>
                    <td>
                      <strong>{f.name}</strong>
                    </td>
                    <td>{f.department}</td>
                    <td>{f.designation}</td>
                    <td>
                      <div className="contact-cell">
                        <small>{f.email}</small>
                        <small className="text-muted">{f.phone}</small>
                      </div>
                    </td>
                    <td>
                      <div className="subject-tags-list">
                        {(f.subjects || []).map((s, i) => (
                          <span key={i} className="sub-tag">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="status-badge active">{f.status || "Active"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default PrincipalFaculty;
