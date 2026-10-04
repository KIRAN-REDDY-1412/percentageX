import { useState } from "react";
import { Edit, Save } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function Profile() {
  const { currentUser, updateUserProfile } = useCollege();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    department: currentUser?.department || "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    showToast("Profile credentials updated successfully!", "success");
  };

  return (
    <AppLayout>
      <div className="profile-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">
              {currentUser?.role?.toUpperCase()} / Profile
            </p>
            <h1>User Profile & Settings</h1>
            <p className="page-description">
              Personal credentials, contact details, and role assignments.
            </p>
          </div>

          <button
            className={isEditing ? "outline-button" : "primary-button"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit size={16} />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-main-card">
          <div className="profile-header-banner">
            <div className="profile-avatar-large">
              {currentUser?.avatar || "PX"}
            </div>
            <div className="profile-title-area">
              <h2>{currentUser?.name}</h2>
              <span className="profile-role-tag">
                {currentUser?.roleLabel || currentUser?.role?.toUpperCase()}
              </span>
              <p className="profile-id-text">ID: {currentUser?.id || currentUser?.rollNumber}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="profile-form-grid">
            <div className="profile-field-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              ) : (
                <p>{currentUser?.name}</p>
              )}
            </div>

            <div className="profile-field-item">
              <label>Official Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              ) : (
                <p>{currentUser?.email}</p>
              )}
            </div>

            <div className="profile-field-item">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <p>{currentUser?.phone || "Not specified"}</p>
              )}
            </div>

            <div className="profile-field-item">
              <label>Role</label>
              <p>{currentUser?.roleLabel}</p>
            </div>

            {currentUser?.department && (
              <div className="profile-field-item">
                <label>Department</label>
                <p>{currentUser?.department}</p>
              </div>
            )}

            {currentUser?.course && (
              <div className="profile-field-item">
                <label>Program / Course</label>
                <p>{currentUser?.course}</p>
              </div>
            )}

            {currentUser?.year && (
              <div className="profile-field-item">
                <label>Year & Section</label>
                <p>
                  {currentUser?.year} • {currentUser?.section}
                </p>
              </div>
            )}

            {currentUser?.assignedSection && (
              <div className="profile-field-item">
                <label>Supervised Section</label>
                <p>{currentUser?.assignedSection}</p>
              </div>
            )}

            {isEditing && (
              <div className="profile-save-btn-row">
                <button type="submit" className="primary-button">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
