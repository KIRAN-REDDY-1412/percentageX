import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Check,
  X,
  ExternalLink,
  Save,
  Trash2,
  Building,
  School,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function CollegeLogoManager({ collegeId: propCollegeId, title = "Institution Logo & Branding" }) {
  const { currentUser, colleges, updateCollegeLogo } = useCollege();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // Target college: from prop or currentUser
  const targetCollegeId = propCollegeId || currentUser?.collegeId;
  const college = colleges.find((c) => c.id === targetCollegeId) || (
    currentUser?.collegeId === targetCollegeId
      ? {
          id: targetCollegeId,
          name: currentUser.collegeName || "My College",
          code: currentUser.collegeCode || "COL",
          logo: currentUser.collegeLogo || null,
        }
      : null
  );

  const [logoPreview, setLogoPreview] = useState(college?.logo || null);
  const [urlInput, setUrlInput] = useState("");
  const [inputMode, setInputMode] = useState("file"); // 'file' | 'url'
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (college) {
      setLogoPreview(college.logo || null);
      setHasChanges(false);
    }
  }, [college?.logo, college?.id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, SVG, WebP).", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size exceeds 2MB. Please select an optimized image under 2MB.", "warning");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setLogoPreview(dataUrl);
      setHasChanges(true);
      showToast("Image loaded! Click 'Save Logo' to apply permanently.", "info");
    };
    reader.onerror = () => {
      showToast("Failed to read image file.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast("Please enter an image URL.", "warning");
      return;
    }
    setLogoPreview(urlInput.trim());
    setHasChanges(true);
    setUrlInput("");
    showToast("Image URL set! Click 'Save Logo' to apply permanently.", "info");
  };

  const handleSave = async () => {
    if (!targetCollegeId) {
      showToast("No college identifier found to associate logo.", "error");
      return;
    }

    try {
      setSaving(true);
      const res = await updateCollegeLogo(targetCollegeId, logoPreview);
      if (res?.success) {
        setHasChanges(false);
        showToast(
          logoPreview
            ? `Logo updated successfully for ${college?.name || "institution"}!`
            : `Logo removed successfully for ${college?.name || "institution"}!`,
          "success"
        );
      } else {
        showToast("Failed to save logo. Please try again.", "error");
      }
    } catch (err) {
      showToast("Error updating logo: " + (err.message || "Failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    setLogoPreview(null);
    setHasChanges(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const collegeCode = (college?.code || "col").toLowerCase();
  const studentPortalUrl = `/student/${collegeCode}`;
  const staffPortalUrl = `/staff/${collegeCode}`;

  if (!college && !targetCollegeId) {
    return null;
  }

  return (
    <div
      className="college-logo-manager-card"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        marginTop: "24px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          paddingBottom: "18px",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
            }}
          >
            <Building size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>
              {title}
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#64748b" }}>
              Controls the official institutional emblem displayed on Student & Staff Portals for{" "}
              <strong>{college?.name || "this College"}</strong> ({college?.code}).
            </p>
          </div>
        </div>

        {/* PORTAL LINKS */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a
            href={staffPortalUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "8px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <span>Staff Portal</span>
            <ExternalLink size={12} />
          </a>
          <a
            href={studentPortalUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "8px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <span>Student Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: UPLOAD / CONTROLS */}
        <div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <button
              type="button"
              onClick={() => setInputMode("file")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 600,
                border: "1px solid",
                borderColor: inputMode === "file" ? "#2563eb" : "#e2e8f0",
                background: inputMode === "file" ? "#eff6ff" : "#ffffff",
                color: inputMode === "file" ? "#2563eb" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Upload size={14} />
              <span>Upload Image File</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 600,
                border: "1px solid",
                borderColor: inputMode === "url" ? "#2563eb" : "#e2e8f0",
                background: inputMode === "url" ? "#eff6ff" : "#ffffff",
                color: inputMode === "url" ? "#2563eb" : "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <LinkIcon size={14} />
              <span>Paste Image URL</span>
            </button>
          </div>

          {inputMode === "file" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #cbd5e1",
                borderRadius: "12px",
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                background: "#f8fafc",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.background = "#f8fafc";
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  color: "#2563eb",
                }}
              >
                <Upload size={20} />
              </div>
              <strong style={{ fontSize: "13px", color: "#1e293b", display: "block" }}>
                Click to browse & upload college logo
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: "#64748b" }}>
                Supports PNG, JPG, SVG, WebP (Max 2MB)
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplyUrl} style={{ display: "flex", gap: "8px" }}>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </form>
          )}

          {/* ACTIONS: SAVE / REMOVE */}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "10px",
                background: hasChanges ? "#2563eb" : "#e2e8f0",
                color: hasChanges ? "#ffffff" : "#94a3b8",
                border: "none",
                fontWeight: 600,
                fontSize: "13px",
                cursor: hasChanges ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: hasChanges ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
                transition: "all 0.2s",
              }}
            >
              <Save size={16} />
              <span>{saving ? "Saving to Database..." : "Save College Logo"}</span>
            </button>

            {logoPreview && (
              <button
                type="button"
                onClick={handleRemove}
                title="Remove current logo"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Trash2 size={15} />
                <span>Remove</span>
              </button>
            )}
          </div>
          {hasChanges && (
            <p style={{ margin: "8px 0 0", fontSize: "11.5px", color: "#d97706", fontWeight: 500 }}>
              • Unsaved changes. Click "Save College Logo" to update the database permanently.
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: DUAL LIVE PREVIEW */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <Sparkles size={16} color="#2563eb" />
            <strong style={{ fontSize: "13px", color: "#0f172a" }}>
              Live Portal Preview (Isolated to {college?.name})
            </strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* 1. STUDENT PORTAL PREVIEW */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "14px 10px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              >
                STUDENT PORTAL
              </span>

              {logoPreview ? (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 10px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 10px",
                    borderRadius: "12px",
                    background: "#10b981",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GraduationCap size={24} />
                </div>
              )}

              <p style={{ margin: "0", fontSize: "11.5px", fontWeight: 700, color: "#1e293b" }}>
                {college?.name || "College Name"}
              </p>
              <span style={{ fontSize: "10px", color: "#64748b" }}>/student/{collegeCode}</span>
            </div>

            {/* 2. STAFF PORTAL PREVIEW */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "14px 10px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#2563eb",
                  background: "#eff6ff",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              >
                STAFF PORTAL
              </span>

              {logoPreview ? (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 10px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 10px",
                    borderRadius: "12px",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <School size={22} />
                </div>
              )}

              <p style={{ margin: "0", fontSize: "11.5px", fontWeight: 700, color: "#1e293b" }}>
                {college?.name || "College Name"}
              </p>
              <span style={{ fontSize: "10px", color: "#64748b" }}>/staff/{collegeCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeLogoManager;
