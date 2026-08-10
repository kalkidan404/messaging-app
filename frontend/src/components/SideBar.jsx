
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/profile";

function Sidebar() {
  const { user, setUser, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState(user?.name || "");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [preview, setPreview] =
    useState(user?.profileImage || "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openEditProfile = () => {
    setName(user?.name || "");
    setSelectedImage(null);
    setPreview(user?.profileImage || "");
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setName(user?.name || "");
    setSelectedImage(null);
    setPreview(user?.profileImage || "");
    setError("");
    setEditing(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await updateProfile(
        name.trim(),
        selectedImage
      );

      const updatedUser =
        response.user ||
        response.data ||
        response;

      setUser(updatedUser);

      setPreview(
        updatedUser.profileImage || ""
      );

      setSelectedImage(null);
      setEditing(false);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Could not update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="sidebar">

      {!editing ? (
        <>
          <div className="profile-section">

            <div className="profile-avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                />
              ) : (
                user?.name
                  ?.charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div className="profile-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>

          </div>

          <button
            type="button"
            className="edit-profile-button"
            onClick={openEditProfile}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <div className="profile-edit">

          <h2>Edit Profile</h2>

          <div className="profile-avatar preview">
            {preview ? (
              <img
                src={preview}
                alt={name}
              />
            ) : (
              name
                ?.charAt(0)
                .toUpperCase()
            )}
          </div>

          <label className="change-photo">
            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <label>
            Username

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your username"
            />
          </label>

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          <div className="profile-actions">

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        Sign Out
      </button>

    </aside>
  );
}

export default Sidebar;
