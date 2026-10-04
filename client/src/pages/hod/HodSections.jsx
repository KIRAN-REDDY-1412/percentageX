import { Grid, Shield } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";

function HodSections() {
  const sections = [
    {
      course: "B.Tech - CSE",
      year: "2nd Year",
      section: "Section A",
      incharge: "Dr. Meera Nambiar",
      studentsCount: 40,
      room: "Room 204",
      subjectsCount: 5,
    },
    {
      course: "B.Tech - CSE",
      year: "2nd Year",
      section: "Section B",
      incharge: "Prof. Sunita Reddy",
      studentsCount: 40,
      room: "Room 205",
      subjectsCount: 5,
    },
    {
      course: "B.Tech - CSE",
      year: "3rd Year",
      section: "Section A",
      incharge: "Prof. Rajesh Kumar",
      studentsCount: 38,
      room: "Room 301",
      subjectsCount: 6,
    },
  ];

  return (
    <AppLayout>
      <div className="admin-page">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">HOD / Department Sections</p>
            <h1>Computer Science Sections</h1>
            <p className="page-description">
              Supervised classrooms, designated section incharges, and active student strengths.
            </p>
          </div>
        </div>

        {/* SECTION CARDS */}
        <div className="my-classes-grid">
          {sections.map((sec, idx) => (
            <div className="my-class-card blue" key={idx}>
              <div className="my-class-title">
                <div className="my-class-icon">
                  <Grid size={22} />
                </div>
                <div>
                  <h2>
                    {sec.course} • {sec.section}
                  </h2>
                  <p>{sec.year}</p>
                </div>
              </div>

              <div className="my-class-details">
                <div>
                  <span>Classroom</span>
                  <strong>{sec.room}</strong>
                </div>
                <div>
                  <span>Enrolled Students</span>
                  <strong>{sec.studentsCount} Students</strong>
                </div>
                <div>
                  <span>Subjects</span>
                  <strong>{sec.subjectsCount} Subjects</strong>
                </div>
              </div>

              <div className="class-schedule-box">
                <div className="schedule-heading">
                  <Shield size={16} />
                  <span>Section Incharge</span>
                </div>
                <div className="section-incharge-highlight">
                  <strong>{sec.incharge}</strong>
                  <span className="text-muted-sm">
                    Responsible for attendance oversight & academic counseling
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default HodSections;
