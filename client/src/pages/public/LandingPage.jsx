import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  School,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Settings,
  Sparkles,
  BarChart3,
  CalendarDays,
  FileCheck2,
  Users2,
  Building2,
  BookOpen,
} from "lucide-react";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="px-landing-wrapper">
      {/* --------------------------------------------------------------------
          Subtle Ambient Animated Background (Rings, Mesh Blobs & Grid)
          -------------------------------------------------------------------- */}
      <div className="px-ambient-bg" aria-hidden="true">
        <div className="px-bg-grid" />
        <div className="px-blob px-blob-1" />
        <div className="px-blob px-blob-2" />
        <div className="px-blob px-blob-3" />
        <div className="px-orbit-ring px-orbit-ring-1" />
        <div className="px-orbit-ring px-orbit-ring-2" />
      </div>

      {/* --------------------------------------------------------------------
          Header & Navigation Bar
          -------------------------------------------------------------------- */}
      <header className="px-landing-header">
        <Link to="/" className="px-brand-group">
          <div className="px-brand-logo-mark">%X</div>
          <div className="px-brand-meta">
            <h1>PercentageX</h1>
            <span>College Management Platform</span>
          </div>
        </Link>

        <div className="px-header-actions">
          <div className="px-nav-badge">
            <Sparkles size={14} />
            <span>Smart • Connected • Simplified</span>
          </div>
          <Link to="/staff" className="px-nav-link-btn secondary">
            <School size={15} />
            <span>Staff Login</span>
          </Link>
          <Link to="/student" className="px-nav-link-btn primary">
            <GraduationCap size={15} />
            <span>Student Portal</span>
          </Link>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          Hero Content & Portal Selection
          -------------------------------------------------------------------- */}
      <main className="px-landing-content">
        {/* Status Pill */}
        <div className="px-hero-pill">
          <span className="pulse-dot" />
          <span>Next-Generation College Academic & Attendance System</span>
        </div>

        {/* Hero Headline */}
        <h2 className="px-hero-title">
          Unified Academic Management for{" "}
          <span className="gradient-text">Modern Institutions</span>
        </h2>

        {/* Subtitle */}
        <p className="px-hero-subtitle">
          Designed specifically for B.Tech, Degree, and Junior Colleges with strict
          role-based access, period-wise attendance automation, internal marks computation,
          and dedicated entry portals.
        </p>

        {/* Trust & Architecture Chips */}
        <div className="px-trust-chips">
          <div className="px-chip">
            <Building2 size={14} color="#2563eb" />
            <span>B.Tech • Degree • Junior College Architecture</span>
          </div>
          <div className="px-chip">
            <ShieldCheck size={14} color="#10b981" />
            <span>Zero Cross-Role Leakage Guarantee</span>
          </div>
          <div className="px-chip">
            <BarChart3 size={14} color="#6366f1" />
            <span>Real-Time Attendance & Marks Engine</span>
          </div>
        </div>

        {/* --------------------------------------------------------------------
            Primary Portal Selection Grid (Staff vs Student)
            -------------------------------------------------------------------- */}
        <div className="px-portals-grid">
          {/* Card 1: Staff Portal */}
          <div className="px-portal-card staff-card">
            <div>
              <div className="px-card-top">
                <div className="px-card-icon-box blue">
                  <School size={28} />
                </div>
                <span className="px-card-badge blue">Institutional Operations</span>
              </div>

              <h3 className="px-card-title">Staff & Faculty Portal</h3>
              <p className="px-card-desc">
                Authorized administrative entry for Faculty members, Heads of Department (HOD),
                Class Incharges, Principals, and College Admins.
              </p>

              <ul className="px-feature-list">
                <li className="px-feature-item">
                  <div className="px-feature-check blue">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Period-wise attendance marking & instant save</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check blue">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Dynamic timetables & personalized class schedules</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check blue">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Internal marks, Mid-1/Mid-2 & lab assessment entry</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check blue">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Assignments posting & syllabus progress tracking</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check blue">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Comprehensive department & college-wide analytics</span>
                </li>
              </ul>
            </div>

            <div>
              <Link to="/staff" className="px-card-cta-btn blue">
                <span>Staff Login Portal</span>
                <ArrowRight size={18} />
              </Link>
              <div className="px-card-hint">
                Auto-routes strictly by database role upon secure authentication
              </div>
            </div>
          </div>

          {/* Card 2: Student Portal */}
          <div className="px-portal-card student-card">
            <div>
              <div className="px-card-top">
                <div className="px-card-icon-box green">
                  <GraduationCap size={28} />
                </div>
                <span className="px-card-badge green">Student Services</span>
              </div>

              <h3 className="px-card-title">Student Academic Portal</h3>
              <p className="px-card-desc">
                Dedicated student gateway. Check your verified real-time attendance percentage,
                internal test marks, timetables, and pending homework.
              </p>

              <ul className="px-feature-list">
                <li className="px-feature-item">
                  <div className="px-feature-check green">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Live aggregate & subject-wise attendance percentages</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check green">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Low attendance warnings & shortage alerts</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check green">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Continuous assessment internal marks & grades</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check green">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Daily lecture timetable & faculty period schedules</span>
                </li>
                <li className="px-feature-item">
                  <div className="px-feature-check green">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Pending coursework, assignments & announcements</span>
                </li>
              </ul>
            </div>

            <div>
              <Link to="/student" className="px-card-cta-btn green">
                <span>Student Access Portal</span>
                <ArrowRight size={18} />
              </Link>
              <div className="px-card-hint">
                Instant verification via Roll Number and Registered Mobile
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------
            Supported Institution Models
            -------------------------------------------------------------------- */}
        <div className="px-colleges-row">
          <div className="px-college-type-card">
            <h4>
              <Building2 size={16} color="#2563eb" />
              <span>B.Tech & Engineering</span>
            </h4>
            <p>
              Branch & HOD departmental governance, semester cycles, Mid-1/Mid-2
              examination scoring, and lab section groups.
            </p>
          </div>

          <div className="px-college-type-card">
            <h4>
              <BookOpen size={16} color="#059669" />
              <span>Degree Colleges</span>
            </h4>
            <p>
              B.Sc, B.Com, and B.A program configurations with Class Incharges,
              semester attendance minimums, and core paper tracking.
            </p>
          </div>

          <div className="px-college-type-card">
            <h4>
              <Users2 size={16} color="#7c3aed" />
              <span>Junior Colleges</span>
            </h4>
            <p>
              MPC, BiPC, MEC & CEC group scheduling with Class Teacher
              attendance registries and daily lecture records.
            </p>
          </div>
        </div>
      </main>

      {/* --------------------------------------------------------------------
          Discreet Floating Super Admin Access (Bottom Right)
          -------------------------------------------------------------------- */}
      <div className="px-floating-superadmin">
        <Link
          to="/super-admin"
          className="px-superadmin-btn"
          title="Access Super Administrator Platform Gateway"
        >
          <Settings size={15} className="admin-icon" />
          <span>Super Admin</span>
        </Link>
      </div>

      {/* --------------------------------------------------------------------
          Footer
          -------------------------------------------------------------------- */}
      <footer className="px-landing-footer">
        <div className="px-footer-left">
          <div className="px-status-indicator">
            <span className="px-status-dot" />
            <span>Academic Engine Operational</span>
          </div>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <span>PercentageX v2.4</span>
        </div>

        <div className="px-footer-right">
          <Link to="/staff">Staff Login</Link>
          <Link to="/student">Student Access</Link>
          <Link to="/super-admin">Super Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
