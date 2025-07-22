import React, { useState } from "react";

function LostItemForm() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    dateLost: "",
    image: null,
    posterName: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Note: localStorage is not available in this environment
    // In a real app, you would get the token from your auth system
    console.log("Form submitted:", formData);
    alert("Lost item post submitted successfully!");
    
    // Reset form
    setFormData({
      itemName: "",
      category: "",
      description: "",
      location: "",
      dateLost: "",
      image: null,
      posterName: "",
      contactNumber: "",
    });
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Accessories",
    "Books",
    "Documents",
    "Keys",
    "Bags",
    "Jewelry",
    "Sports Equipment",
    "Other"
  ];

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
        <div className="form-container">
          <div className="form-header">
            <h1>Post Lost Item</h1>
            <p>Fill in the details below to post about your lost item</p>
          </div>

          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemName">Item Name *</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  placeholder="Enter the name of your lost item"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of your lost item"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Last Seen Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Where did you last see your item?"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateLost">Date Lost *</label>
                <input
                  type="date"
                  id="dateLost"
                  name="dateLost"
                  value={formData.dateLost}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image *</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
                <div className="file-upload-display">
                  <span className="file-text">
                    {formData.image ? formData.image.name : "Choose an image file"}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="posterName">Your Name *</label>
                <input
                  type="text"
                  id="posterName"
                  name="posterName"
                  placeholder="Enter your full name"
                  value={formData.posterName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary">
                Previous step
              </button>
              <button type="button" onClick={handleSubmit} className="btn-primary">
                Submit Post
              </button>
            </div>
          </div>
        </div>
      </div>

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

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .form-header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
          color: white;
          padding: 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .form-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }

        .form-header h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .form-header p {
          opacity: 0.95;
          font-size: 1.125rem;
          font-weight: 400;
          position: relative;
          z-index: 2;
        }

        .form-content {
          padding: 2.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #374151;
          font-size: 0.95rem;
          letter-spacing: 0.025em;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: #fff;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
          transform: translateY(-1px);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #9ca3af;
        }

        .form-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
          padding-right: 3rem;
        }

        .file-upload-container {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
        }

        .file-upload-display {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          background-color: #f9fafb;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 60px;
        }

        .file-upload-container:hover .file-upload-display {
          border-color: #dc2626;
          background-color: #fef2f2;
        }

        .file-text {
          font-size: 0.95rem;
          color: #6b7280;
          flex-grow: 1;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
        }

        .btn-secondary,
        .btn-primary {
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
        }

        .btn-secondary {
          background-color: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background-color: #f3f4f6;
          border-color: #dc2626;
          color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
        }

        .btn-primary:active {
          transform: translateY(0);
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

          .form-content {
            padding: 1.5rem;
          }

          .form-header {
            padding: 2rem 1.5rem;
          }

          .form-header h1 {
            font-size: 1.75rem;
          }

          .form-header p {
            font-size: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
            margin-top: 2rem;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-container {
            border-radius: 12px;
            margin: 0.5rem;
          }

          .form-header {
            padding: 1.5rem;
          }

          .form-header h1 {
            font-size: 1.5rem;
          }

          .form-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LostItemForm;