import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Phone, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../../config';

function LostItemsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lostItems, setLostItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    "All",
    "electronics",
    "bags",
    "accessories",
    "books",
    "clothing",
    "keys",
    "documents",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/lost/lost-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLostItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    fetchLostItems();
  }, []);

  // Filter items based on search and category
  const filteredItems = lostItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleCreatePost = () => {
    navigate("/union/LostandFoundForm");
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/lost/lost-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLostItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete the post");
    }
  };

  return (
    <div className="app-container">
      <header className="lf-header-bar">
        <div className="lf-header-left">
          <span className="lf-title">ReidConnect</span>
          <span className="lf-title lf-highlight">UnionAdmin</span>
        </div>
      </header>
      {/* Main Content */}
      <main className="main-content" style={{ marginTop: '70px' }}>
        <h2 className="page-title">Lost & Found</h2>

        <header className="gallery-header">
          <div className="header-text">
            <h3 className="gallery-subtitle">Active Lost Item Posts</h3>
            <p>Browse through recent lost items reported by the community</p>
          </div>

          <div className="controls">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search lost items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <button className="create-post-btn" onClick={handleCreatePost}>
              <Plus size={18} />
              Create Post
            </button>
          </div>
        </header>

        {/* Items grid */}
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <h3>No lost items found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map((item) => (

              <div
                key={item.id}
                className="gallery-card"
                onClick={() => openModal(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openModal(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-info">
                  <div className="gallery-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal opening
                        navigate(`/union/LostandFoundForm?id=${item.id}`);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this item?")) {
                          handleDelete(item.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <h3>{item.itemName}</h3>
                  <p className="gallery-category">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedItem && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>

              <div className="modal-image">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.itemName}
                />
              </div>

              <div className="modal-details">
                <div className="modal-header">
                  <h2>{selectedItem.itemName}</h2>
                  <span className="modal-category">{selectedItem.category}</span>
                </div>

                <p className="modal-description">{selectedItem.description}</p>

                <div className="modal-info">
                  <div className="info-item">
                    <MapPin size={20} />
                    <div>
                      <strong>Last Seen Location</strong>
                      <p>{selectedItem.location}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Calendar size={20} />
                    <div>
                      <strong>Date Lost</strong>
                      <p>{selectedItem.dateLost}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <User size={20} />
                    <div>
                      <strong>Posted by</strong>
                      <p>{selectedItem.posterName}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Phone size={20} />
                    <div>
                      <strong>Contact Number</strong>
                      <p>{selectedItem.contactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="contact-btn">
                    <Phone size={18} />
                    Contact Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        /* Main content - Academic Dark Theme */
        .main-content {
          margin-left: 200px;
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }

        .lf-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 70px;
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1200;
          background: rgba(20, 20, 20, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .lf-header-left {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .lf-title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .lf-highlight {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Gallery header */
        .gallery-header {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gallery-subtitle {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .header-text p {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 20px;
          font-size: 14px;
        }

        .controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .gallery-actions {
          display: flex;
          justify-content: space-between;
          padding: 0 0 10px 0;
          gap: 8px;
        }

        .edit-btn, .delete-btn {
          flex: 1;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: translateY(-1px);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          transform: translateY(-1px);
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 400;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          outline: none;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .category-filter {
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          backdrop-filter: blur(10px);
        }

        .category-filter option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .category-filter:focus {
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .create-post-btn {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
          font-size: 15px;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .create-post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        /* No results message */
        .no-results {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .no-results h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .no-results p {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Gallery grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .gallery-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .gallery-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .gallery-info {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gallery-info h3 {
          color: #ffffff;
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .gallery-category {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          text-transform: capitalize;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1300;
        }

        .modal-content {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 20px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .modal-image {
          width: 100%;
          height: 300px;
          overflow: hidden;
          background-color: #1a1a1a;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-details {
          padding: 24px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header h2 {
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .modal-category {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .modal-description {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 24px;
          line-height: 1.6;
          font-size: 15px;
        }

        .modal-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .info-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-item svg {
          color: #FF453A;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-item strong {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-item p {
          color: #ffffff;
          margin: 0;
          font-size: 15px;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
        }

        .contact-btn {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 15px;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 20px 12px;
          }

          .page-title {
            font-size: 24px;
          }

          .gallery-header {
            padding: 20px;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-bar,
          .category-filter,
          .create-post-btn {
            width: 100%;
            max-width: none;
          }

          .modal-info {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
            flex-direction: column;
          }

          .modal-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default LostItemsGallery;
