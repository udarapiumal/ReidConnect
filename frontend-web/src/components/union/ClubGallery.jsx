import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Clubgallery.css";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const ClubGallery = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [pendingClubs, setPendingClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // Detail popup state
  const [selectedClub, setSelectedClub] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState(null);
  // { type: 'approve' | 'reject', club, rejectionReason? }

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchClubs = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/club`, authHeaders);
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPendingClubs = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/club/pending`,
        authHeaders
      );
      setPendingClubs(response.data);
    } catch (error) {
      console.error("Error fetching pending clubs:", error);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
    fetchPendingClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Approval Flow ---
  const openApproveConfirm = (club) => {
    setConfirmDialog({ type: "approve", club, rejectionReason: "" });
  };

  const openRejectConfirm = (club) => {
    setConfirmDialog({ type: "reject", club, rejectionReason: "" });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    const { type, club, rejectionReason } = confirmDialog;

    if (type === "reject" && !rejectionReason.trim()) return;

    setActionLoading(club.id);
    closeConfirmDialog();

    try {
      if (type === "approve") {
        await axios.put(
          `${BASE_URL}/api/club/${club.id}/approve`,
          {},
          authHeaders
        );
        showToast(
          `"${club.clubName}" has been approved successfully!`,
          "success"
        );
      } else {
        await axios.delete(
          `${BASE_URL}/api/club/${club.id}/reject`,
          authHeaders
        );
        showToast(
          `"${club.clubName}" has been rejected and removed.`,
          "success"
        );
      }
      // Close detail popup if the acted-upon club was open
      if (selectedClub && selectedClub.id === club.id) {
        setSelectedClub(null);
      }
      fetchPendingClubs();
      fetchClubs();
    } catch (error) {
      console.error(`Error ${type}ing club:`, error);
      showToast(`Failed to ${type} club. Please try again.`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // --- Filtering ---
  const approvedClubs = clubs.filter((c) => c.userEnabled === true);

  const filteredApprovedClubs = approvedClubs.filter((club) =>
    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingClubs = pendingClubs.filter((club) =>
    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayClubs =
    activeTab === "approved" ? filteredApprovedClubs : filteredPendingClubs;

  // --- Helpers ---
  const formatWebsiteUrl = (url) => {
    if (!url) return null;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const getDomainName = (url) => {
    if (!url) return "—";
    try {
      return new URL(formatWebsiteUrl(url)).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div className="cg-container">
      {/* Toast */}
      {toast && (
        <div className={`cg-toast cg-toast-${toast.type}`}>
          <span className="cg-toast-icon">
            {toast.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            )}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Title */}
      <h2 className="cg-page-title">Club Management</h2>

      {/* Controls Row */}
      <div className="cg-controls">
        <div className="cg-tab-group">
          <button
            className={`cg-tab ${activeTab === "approved" ? "cg-tab-active" : ""}`}
            onClick={() => { setActiveTab("approved"); setSearchTerm(""); }}
          >
            Approved Clubs
            <span className="cg-tab-count">{approvedClubs.length}</span>
          </button>
          <button
            className={`cg-tab ${activeTab === "pending" ? "cg-tab-active" : ""}`}
            onClick={() => { setActiveTab("pending"); setSearchTerm(""); }}
          >
            Pending Approvals
            {pendingClubs.length > 0 && (
              <span className="cg-tab-count cg-tab-count-pending">
                {pendingClubs.length}
              </span>
            )}
          </button>
        </div>
        <div className="cg-search-wrapper">
          <svg className="cg-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            className="cg-search-input"
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="cg-table-card">
        {displayClubs.length === 0 ? (
          <div className="cg-empty">
            <div className="cg-empty-icon">
              {activeTab === "approved" ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"><polyline points="20 6 9 17 4 12" /></svg>
              )}
            </div>
            <p className="cg-empty-title">
              {activeTab === "approved"
                ? "No approved clubs found"
                : "No pending approvals"}
            </p>
            <p className="cg-empty-sub">
              {activeTab === "approved"
                ? "Approved clubs will appear here."
                : "All club registrations have been reviewed."}
            </p>
          </div>
        ) : (
          <table className="cg-table">
            <thead>
              <tr>
                <th>Club</th>
                {activeTab === "approved" ? (
                  <>
                    <th>Website</th>
                    <th>Bio</th>
                    <th>Owner</th>
                  </>
                ) : (
                  <>
                    <th>Email</th>
                    <th>Bio</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayClubs.map((club) => (
                <tr
                  key={club.id}
                  className={`cg-row ${activeTab === "pending" ? "cg-row-pending" : ""}`}
                  onClick={() => {
                    if (activeTab === "pending") setSelectedClub(club);
                    else navigate(`/club/${club.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Club name + avatar */}
                  <td>
                    <div className="cg-club-cell">
                      <div className="cg-avatar">
                        <img
                          src={
                            club.profilePicture
                              ? `${BASE_URL}${club.profilePicture}`
                              : "/default-profile.png"
                          }
                          alt={club.clubName || "Club"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                      </div>
                      <div className="cg-club-info">
                        <span className="cg-club-name">
                          {club.clubName || "Unnamed Club"}
                        </span>
                        <span className="cg-club-username">
                          @{club.username}
                        </span>
                      </div>
                    </div>
                  </td>

                  {activeTab === "approved" ? (
                    <>
                      <td>
                        {club.website ? (
                          <a
                            href={formatWebsiteUrl(club.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cg-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {getDomainName(club.website)}
                          </a>
                        ) : (
                          <span className="cg-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className="cg-bio" title={club.bio || ""}>
                          {club.bio
                            ? club.bio.length > 60
                              ? `${club.bio.substring(0, 60)}…`
                              : club.bio
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="cg-muted">
                          {club.email || "—"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <span className="cg-muted">
                          {club.email || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="cg-bio" title={club.bio || ""}>
                          {club.bio
                            ? club.bio.length > 50
                              ? `${club.bio.substring(0, 50)}…`
                              : club.bio
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="cg-badge cg-badge-pending">
                          Pending Review
                        </span>
                      </td>
                      <td>
                        <div className="cg-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="cg-btn-approve"
                            onClick={() => openApproveConfirm(club)}
                            disabled={actionLoading === club.id}
                          >
                            {actionLoading === club.id ? (
                              <span className="cg-spinner" />
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            className="cg-btn-reject"
                            onClick={() => openRejectConfirm(club)}
                            disabled={actionLoading === club.id}
                          >
                            {actionLoading === club.id ? (
                              <span className="cg-spinner" />
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========== PENDING CLUB DETAIL POPUP ========== */}
      {selectedClub && (
        <>
          <div
            className="cg-overlay"
            onClick={() => setSelectedClub(null)}
          />
          <div className="cg-detail-popup">
            {/* Cover image */}
            <div className="cg-detail-cover">
              {selectedClub.coverPicture ? (
                <img
                  src={`${BASE_URL}${selectedClub.coverPicture}`}
                  alt="Cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="cg-detail-cover-placeholder" />
              )}
              <button
                className="cg-detail-close"
                onClick={() => setSelectedClub(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Profile avatar overlapping cover */}
            <div className="cg-detail-avatar-wrapper">
              <img
                className="cg-detail-avatar"
                src={
                  selectedClub.profilePicture
                    ? `${BASE_URL}${selectedClub.profilePicture}`
                    : "/default-profile.png"
                }
                alt={selectedClub.clubName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />
            </div>

            {/* Club info */}
            <div className="cg-detail-body">
              <h3 className="cg-detail-name">
                {selectedClub.clubName || "Unnamed Club"}
              </h3>
              <span className="cg-detail-username">
                @{selectedClub.username}
              </span>

              <div className="cg-detail-grid">
                <div className="cg-detail-field">
                  <span className="cg-detail-label">Email</span>
                  <span className="cg-detail-value">
                    {selectedClub.email || "—"}
                  </span>
                </div>
                <div className="cg-detail-field">
                  <span className="cg-detail-label">Website</span>
                  <span className="cg-detail-value">
                    {selectedClub.website ? (
                      <a
                        href={formatWebsiteUrl(selectedClub.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cg-link"
                      >
                        {getDomainName(selectedClub.website)}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="cg-detail-field">
                  <span className="cg-detail-label">Account Status</span>
                  <span className="cg-detail-value">
                    <span className="cg-badge cg-badge-pending">
                      Pending Review
                    </span>
                  </span>
                </div>
                <div className="cg-detail-field">
                  <span className="cg-detail-label">User ID</span>
                  <span className="cg-detail-value">
                    {selectedClub.userId || "—"}
                  </span>
                </div>
              </div>

              {/* Bio — full width */}
              <div className="cg-detail-field cg-detail-field-full">
                <span className="cg-detail-label">Bio</span>
                <p className="cg-detail-bio">
                  {selectedClub.bio || "No bio provided."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="cg-detail-actions">
                <button
                  className="cg-btn-approve cg-btn-lg"
                  onClick={() => openApproveConfirm(selectedClub)}
                  disabled={actionLoading === selectedClub.id}
                >
                  {actionLoading === selectedClub.id ? (
                    <span className="cg-spinner" />
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Approve Club
                    </>
                  )}
                </button>
                <button
                  className="cg-btn-reject cg-btn-lg"
                  onClick={() => openRejectConfirm(selectedClub)}
                  disabled={actionLoading === selectedClub.id}
                >
                  {actionLoading === selectedClub.id ? (
                    <span className="cg-spinner" />
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      Reject Club
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== CONFIRMATION DIALOG ========== */}
      {confirmDialog && (
        <>
          <div
            className="cg-overlay cg-overlay-confirm"
            onClick={closeConfirmDialog}
          />
          <div className="cg-confirm-dialog">
            <div className="cg-confirm-header">
              <div
                className={`cg-confirm-icon-circle ${confirmDialog.type === "approve"
                  ? "cg-confirm-icon-approve"
                  : "cg-confirm-icon-reject"
                  }`}
              >
                {confirmDialog.type === "approve" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                )}
              </div>
              <h3 className="cg-confirm-title">
                {confirmDialog.type === "approve"
                  ? "Approve Club Registration"
                  : "Reject Club Registration"}
              </h3>
              <p className="cg-confirm-subtitle">
                {confirmDialog.type === "approve" ? (
                  <>
                    Are you sure you want to approve{" "}
                    <strong>"{confirmDialog.club.clubName}"</strong>? The club
                    account will be activated and they can start using the
                    platform.
                  </>
                ) : (
                  <>
                    Are you sure you want to reject{" "}
                    <strong>"{confirmDialog.club.clubName}"</strong>? This will
                    permanently delete the club and its associated user account.
                  </>
                )}
              </p>
            </div>

            {/* Rejection reason */}
            {confirmDialog.type === "reject" && (
              <div className="cg-confirm-reason">
                <label className="cg-confirm-reason-label">
                  Reason for Rejection <span className="cg-required">*</span>
                </label>
                <textarea
                  className="cg-confirm-textarea"
                  placeholder="Provide a clear reason for rejecting this club registration..."
                  rows={3}
                  value={confirmDialog.rejectionReason}
                  onChange={(e) =>
                    setConfirmDialog({
                      ...confirmDialog,
                      rejectionReason: e.target.value,
                    })
                  }
                />
                {confirmDialog.rejectionReason.trim() === "" && (
                  <span className="cg-confirm-hint">
                    A rejection reason is required.
                  </span>
                )}
              </div>
            )}

            <div className="cg-confirm-footer">
              <button className="cg-btn-cancel" onClick={closeConfirmDialog}>
                Cancel
              </button>
              <button
                className={
                  confirmDialog.type === "approve"
                    ? "cg-btn-approve cg-btn-lg"
                    : "cg-btn-reject cg-btn-lg"
                }
                onClick={handleConfirmAction}
                disabled={
                  confirmDialog.type === "reject" &&
                  !confirmDialog.rejectionReason.trim()
                }
              >
                {confirmDialog.type === "approve"
                  ? "Yes, Approve"
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClubGallery;
