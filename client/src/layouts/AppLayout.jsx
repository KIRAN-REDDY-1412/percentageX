import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useCollege } from "../context/CollegeContext";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useCollege();

  const role = currentUser?.role || "faculty";
  const roleName =
    role === "super_admin"
      ? "Super Admin"
      : role === "hod"
      ? "HOD"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="faculty-layout">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-mesh-blob blob-1"></div>
        <div className="ambient-mesh-blob blob-2"></div>
      </div>

      {/* MOBILE TOP BAR */}
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="mobile-brand">
          <div className="mobile-logo-mark">P</div>
          <span className="mobile-brand-name">PercentageX</span>
        </div>

        <div className="mobile-role-pill">
          <span>{roleName}</span>
        </div>
      </header>

      {/* SIDEBAR WITH MOBILE DRAWER SUPPORT */}
      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <div className="page-transition-wrap">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
