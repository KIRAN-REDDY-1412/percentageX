import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function HodFaculty() {
  const { facultyMembers, currentUser } = useCollege();
  const [searchQuery, setSearchQuery] = useState("");

  const deptName = currentUser?.department || "Computer Science & Engineering";
  const deptFaculty = facultyMembers.filter(
    (f) => !f.department || f.department.toLowerCase().includes("computer") || f.department === deptName
  );

  const filtered = deptFaculty.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Faculty</p>
            <h1>{deptName} Faculty Directory</h1>
            <p className="page-description">
              Teaching professors, subject allocations, and academic course loads.
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="filter-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search faculty by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FACULTY CARDS */}
        <div className="my-classes-grid">
          {filtered.map((faculty) => (
            <div className="my-class-card blue" key={faculty.id}>
              <div className="my-class-title">
                <div className="faculty-avatar-circle">
                  {faculty.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h2>{faculty.name}</h2>
                  <p>{faculty.designation}</p>
                </div>
              </div>

              <div className="my-class-details">
                <div>
                  <span>Contact Email</span>
                  <strong>{faculty.email}</strong>
                </div>
                <div>
                  <span>Phone Number</span>
                  <strong>{faculty.phone}</strong>
                </div>
                <div>
                  <span>Department</span>
                  <strong>{faculty.department}</strong>
                </div>
              </div>

              <div className="class-schedule-box">
                <div className="schedule-heading">
                  <BookOpen size={16} />
                  <span>Assigned Subjects</span>
                </div>
                <div className="faculty-subjects-tags">
                  {(faculty.subjects || ["Database Management Systems", "Operating Systems"]).map(
                    (sub, idx) => (
                      <span key={idx} className="subject-chip">
                        {sub}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default HodFaculty;
