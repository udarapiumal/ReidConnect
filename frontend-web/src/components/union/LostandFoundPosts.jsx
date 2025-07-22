import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Phone, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get("http://localhost:8080/lost/lost-items", {
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
    await axios.delete(`http://localhost:8080/lost/lost-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLostItems(prevItems => prevItems.filter(item => item.id !== id));
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("Failed to delete the post");
  }
};

console.log(filteredItems)
  return (
    <div className="app-container">
      {/* Main Content */}
      <main className="main-content">
        <header className="gallery-header">
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
                  src={`http://localhost:8080/${selectedItem.imageUrl}`}
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

      <style jsx>{`
        /* Main content - Dark Theme */
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1c1e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
        }

        /* Gallery header */
        .gallery-header {
          background: #151718;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .header-text p {
          color: #a1a1a1;
          margin-bottom: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
          .gallery-actions {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem 1rem;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 0.4rem;
  border: none;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background-color: #2563eb;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
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
          color: #a1a1a1;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
          background-color: #2a2a2a;
          color: #ffffff;
        }

        .search-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        .category-filter {
          padding: 0.75rem 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: #2a2a2a;
          color: #ffffff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .category-filter:focus {
          outline: none;
          border-color: #ef4444;
        }

        .create-post-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 14px;
        }

        .create-post-btn:hover {
          background: #dc2626;
        }

        /* No results message */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: #151718;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .no-results p {
          color: #a1a1a1;
        }

        /* Gallery grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .gallery-card {
          background-color: #151718;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgb(0 0 0 / 0.25);
          cursor: pointer;
          transition: transform 0.2s ease;
          border: 1px solid #333;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgb(239 68 68 / 0.5);
        }

        .gallery-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-bottom: 1px solid #333;
          flex-shrink: 0;
        }

        .gallery-info {
          padding: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gallery-info h3 {
          color: #ffffff;
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
        }

        .gallery-category {
          background-color: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
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
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #151718;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          border: 1px solid #333;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #a1a1a1;
          cursor: pointer;
          z-index: 10;
        }

        .modal-image {
          width: 100%;
          height: 300px;
          overflow: hidden;
          background-color: #2a2a2a;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-details {
          padding: 1.5rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          color: #ffffff;
          font-size: 1.5rem;
          margin: 0;
        }

        .modal-category {
          background-color: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .modal-description {
          color: #e5e5e5;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .modal-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .info-item svg {
          color: #ef4444;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .info-item strong {
          color: #ffffff;
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }

        .info-item p {
          color: #a1a1a1;
          margin: 0;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
        }

        .contact-btn {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.2s ease;
        }

        .contact-btn:hover {
          background-color: #dc2626;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
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
