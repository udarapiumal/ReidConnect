import React, { useState } from "react";
import { Search, Calendar, MapPin, Phone, User, Tag, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LostItemsGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  // Sample data for lost items
  const sampleItems = [
    // ... (keep your existing sampleItems array)
  ];

  const categories = ["All", "Electronics", "Bags", "Accessories", "Books", "Clothing", "Keys", "Documents"];

  const filteredItems = sampleItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };
const navigate=useNavigate();
  const handleCreatePost = () => {
    navigate("/union/LostandFoundForm"); // navigates to the About component
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Reid Connect</h2>
        <ul className="nav-links">
          <li>
            <a href="/" className="">Home</a>
          </li>
          <li>
            <a href="/union/LostandFound" className="active">Lost and Found</a>
          </li>
          <li>
            <a href="/union/Profilemanagement" className="">Profile Management</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="gallery-header">
          <div className="header-text">
            <h1>Active Lost Item Posts</h1>
            <p>Browse through recent lost items reported by the community</p>
          </div>

          <div className="controls">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Add the Create Post button here */}
            <button className="create-post-btn" onClick={handleCreatePost}>
              <Plus size={18} />
              Create Post
            </button>
          </div>
        </div>

        {/* ... rest of your component remains the same ... */}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-image">
              <img src={selectedItem.image} alt={selectedItem.itemName} />
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

      <style jsx>{`
        .app-container {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          min-height: 100vh;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 220px;
          background-color: #151718;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #FF0033;
          z-index: 1000;
        }

        .logo {
          color: #FF0033;
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
        }

        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .nav-links a {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: block;
        }

        .nav-links a:hover {
          background-color: #1e1e1e;
          color: #FF0033;
        }

        .nav-links a.active {
          background-color: #1e1e1e;
          color: #FF0033;
        }

        .main-content {
          margin-left: 220px;
          min-height: 100vh;
          padding: 2rem;
          background-color: #f8fafc;
        }

        .gallery-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .header-text p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .category-filter {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-filter:focus {
          outline: none;
          border-color: #dc2626;
        }

        /* Add styles for the Create Post button */
        .create-post-btn {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .create-post-btn:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
        }

        .results-info {
          margin-bottom: 1.5rem;
          color: #64748b;
          font-weight: 500;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .item-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .item-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .item-content {
          padding: 1.5rem;
        }

        .item-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }

        .item-description {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .poster-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .time-posted {
          color: #9ca3af;
          font-size: 0.85rem;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .no-results h3 {
          font-size: 1.5rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: #64748b;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image {
          height: 300px;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-details {
          padding: 2rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
        }

        .modal-category {
          background: #dc2626;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .modal-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        .modal-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .info-item svg {
          color: #dc2626;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .info-item strong {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .info-item p {
          color: #64748b;
          margin: 0;
        }

        .modal-actions {
          padding-top: 1.5rem;
          border-top: 2px solid #f1f5f9;
        }

        .contact-btn {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .contact-btn:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            flex-direction: row;
            justify-content: space-around;
            border-right: none;
            border-bottom: 2px solid #FF0033;
            position: relative;
          }

          .nav-links {
            flex-direction: row;
            gap: 1rem;
          }

          .logo {
            margin-bottom: 0;
            font-size: 1.25rem;
          }

          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .gallery-header {
            padding: 1.5rem;
          }

          .controls {
            flex-direction: column;
            gap: 1rem;
          }

          .search-bar {
            max-width: none;
          }

          .create-post-btn {
            width: 100%;
            justify-content: center;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .modal-overlay {
            padding: 1rem;
          }

          .modal-details {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LostItemsGallery;