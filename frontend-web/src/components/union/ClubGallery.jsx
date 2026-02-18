import React, { useEffect, useState } from "react";
import ClubCard from "./ClubCard";
import "../../css/Clubgallery.css";
import axios from "axios";

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchClubs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/club",
        authHeaders,
      );
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const fetchPendingClubs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/club/pending",
        authHeaders,
      );
      setPendingClubs(response.data);
    } catch (error) {
      console.error("Error fetching pending clubs:", error);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchPendingClubs();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (clubId, clubName) => {
    setActionLoading(clubId);
    try {
      await axios.put(
        `http://localhost:8080/api/club/${clubId}/approve`,
        {},
        authHeaders,
      );
      showToast(`"${clubName}" has been approved successfully!`, "success");
      fetchPendingClubs();
      fetchClubs();
    } catch (error) {
      console.error("Error approving club:", error);
      showToast("Failed to approve club. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (clubId, clubName) => {
    if (
      !window.confirm(
        `Are you sure you want to reject "${clubName}"? This will permanently delete the club and its user account.`,
      )
    ) {
      return;
    }
    setActionLoading(clubId);
    try {
      await axios.delete(
        `http://localhost:8080/api/club/${clubId}/reject`,
        authHeaders,
      );
      showToast(`"${clubName}" has been rejected and removed.`, "success");
      fetchPendingClubs();
    } catch (error) {
      console.error("Error rejecting club:", error);
      showToast("Failed to reject club. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter clubs based on search term
  const filteredClubs = clubs.filter((club) =>
    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPendingClubs = pendingClubs.filter((club) =>
    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="club-gallery-container">
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          backdropFilter: "blur(20px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          zIndex: 1200,
          background: "rgba(20,20,20,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
          <span style={{ fontWeight: 700, fontSize: "22px", color: "white" }}>
            ReidConnect
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: "22px",
              color: "#FF0033",
              background: "linear-gradient(135deg,#FF0033 0%,#ea580c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginLeft: "0px",
            }}
          >
            UnionAdmin
          </span>
        </div>
      </header>

      {/* Toast notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div
        className="gallery-header"
        style={{
          marginTop: "70px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setSearchTerm("");
            }}
          >
            All Clubs
            <span className="tab-badge">{clubs.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "pending" ? "tab-active" : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setSearchTerm("");
            }}
          >
            Pending Approvals
            {pendingClubs.length > 0 && (
              <span className="tab-badge tab-badge-pending">
                {pendingClubs.length}
              </span>
            )}
          </button>
        </div>
        <div className="search-container" style={{ width: "300px" }}>
          <input
            type="text"
            placeholder="Search club by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="clubs-table-container" style={{ marginTop: "1rem" }}>
        {activeTab === "all" ? (
          /* All Clubs Tab */
          filteredClubs.length === 0 ? (
            <div className="no-clubs">
              <p>No clubs found.</p>
            </div>
          ) : (
            <table className="clubs-table">
              <thead>
                <tr>
                  <th className="name-col">Name</th>
                  <th className="website-col">Website</th>
                  <th className="members-col">Members</th>
                  <th className="bio-col">Bio</th>
                  <th className="owner-col">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </tbody>
            </table>
          )
        ) : /* Pending Approvals Tab */
        filteredPendingClubs.length === 0 ? (
          <div className="no-clubs">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <p>No pending club approvals.</p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              All club registrations have been reviewed.
            </p>
          </div>
        ) : (
          <table className="clubs-table">
            <thead>
              <tr>
                <th className="name-col">Club Name</th>
                <th className="website-col">Email</th>
                <th className="bio-col">Bio</th>
                <th className="status-col">Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingClubs.map((club) => (
                <tr key={club.id} className="club-row pending-row">
                  <td className="name-col">
                    <div className="club-name-cell">
                      <div className="club-avatar">
                        <img
                          src={
                            club.profilePicture
                              ? `http://localhost:8080${club.profilePicture}`
                              : "/default-profile.png"
                          }
                          alt={`${club.clubName || "Club"} profile`}
                          className="club-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                      </div>
                      <div>
                        <span className="club-name">
                          {club.clubName || "Unnamed Club"}
                        </span>
                        <span
                          className="club-username"
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            color: "#888",
                          }}
                        >
                          @{club.username}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="website-col">
                    <span style={{ color: "#ccc" }}>
                      {club.email || "No email"}
                    </span>
                  </td>
                  <td className="bio-col">
                    <span className="club-bio" title={club.bio || "No bio"}>
                      {club.bio
                        ? club.bio.length > 50
                          ? `${club.bio.substring(0, 50)}...`
                          : club.bio
                        : "No bio"}
                    </span>
                  </td>
                  <td className="status-col">
                    <span className="status-badge status-pending">Pending</span>
                  </td>
                  <td className="actions-col">
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(club.id, club.clubName)}
                        disabled={actionLoading === club.id}
                      >
                        {actionLoading === club.id ? "..." : "✓ Approve"}
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(club.id, club.clubName)}
                        disabled={actionLoading === club.id}
                      >
                        {actionLoading === club.id ? "..." : "✕ Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClubGallery;
