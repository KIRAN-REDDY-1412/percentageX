import { Shield } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function InchargeSection() {
  const { currentUser, students, assignments } = useCollege();

  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  const sectionStudents = students.filter(
    (s) => s.course === course && s.year === year && s.section === section
  );

  const sectionClasses = assignments.filter(
    (a) => a.course === course && a.year === year && a.section === section
  );

  return (
    <AppLayout>
      <div className="incharge-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Incharge / My Section</p>
            <h1>Section Administration & Overview</h1>
            <p className="page-description">
              Academic structure for {course} • {year} ({section})
            </p>
          </div>
        </div>

        {/* SECTION HERO CARD */}
        <div className="my-class-card blue mb-4">
          <div className="my-class-title">
            <div className="my-class-icon">
              <Shield size={24} />
            </div>
            <div>
              <h2>{course} — {section}</h2>
              <p>{year} • Department of Computer Science & Engineering</p>
            </div>
          </div>

          <div className="my-class-details">
            <div>
              <span>Designated Classroom</span>
              <strong>Room 204 (Academic Block B)</strong>
            </div>
            <div>
              <span>Class Strength</span>
              <strong>{sectionStudents.length} Students (Roll 2301 - 2340)</strong>
            </div>
            <div>
              <span>Section Supervisor</span>
              <strong>{currentUser?.name || "Dr. Meera Nambiar"}</strong>
            </div>
          </div>
        </div>

        {/* TEACHING FACULTY ROSTER */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Assigned Teaching Faculty & Subjects</h2>
              <p>Faculty members teaching courses in this section</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Faculty Member</th>
                  <th>Weekly Frequency</th>
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                {sectionClasses.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.subject}</strong>
                    </td>
                    <td>{item.facultyName || "Prof. Rajesh Kumar"}</td>
                    <td>{item.schedule?.length || 4} Lectures / Week</td>
                    <td>{item.room || "Room 204"}</td>
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

export default InchargeSection;
