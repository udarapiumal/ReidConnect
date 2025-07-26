import React, { useState } from "react";
import axios from 'axios';

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

    const {
      itemName,
      category,
      description,
      location,
      dateLost,
      image,
      posterName,
      contactNumber,
    } = formData;

    if (
      !itemName.trim() ||
      !category.trim() ||
      !description.trim() ||
      !location.trim() ||
      !dateLost ||
      !image ||
      !posterName.trim() ||
      !contactNumber.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("itemName", itemName);
      formPayload.append("category", category);
      formPayload.append("description", description);
      formPayload.append("location", location);
      formPayload.append("dateLost", dateLost);
      formPayload.append("image", image);
      formPayload.append("posterName", posterName);
      formPayload.append("contactNumber", contactNumber);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/lost/lost-items",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      alert("Lost item post submitted successfully!");
      console.log(response.data);

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
    } catch (error) {
      console.error("Error posting lost item:", error);
      alert("Failed to submit the lost item post.");
    }
  };

  const categories = [
    "Electronics", "Clothing", "Accessories", "Books",
    "Documents", "Keys", "Bags", "Jewelry",
    "Sports Equipment", "Other"
  ];

  return (
    <div className="app-container">
      <header className="header">
        <div className="title">ReidConnect <span className="highlight">LostFound</span></div>
        <div className="user-info">
          <i className="fa fa-bell" />
          <i className="fa fa-user" />
          <span>User</span>
        </div>
      </header>

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
                  value={formData.itemName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter the name of your lost item"
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
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Provide a detailed description of your lost item"
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Last Seen Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Where did you last see your item?"
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
                  <i className="fa fa-cloud-upload upload-icon" />
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
                  value={formData.posterName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary">
                <i className="fa fa-arrow-left" />
                Previous Step
              </button>
              <button type="button" onClick={handleSubmit} className="btn-primary">
                <i className="fa fa-paper-plane" />
                Submit Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .app-container {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          z-index: 1001;
        }

        .title {
          font-weight: bold;
          font-size: 20px;
          color: white;
        }

        .title .highlight {
          color: #ef4444;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info i {
          font-size: 20px;
          cursor: pointer;
          color: white;
          transition: color 0.3s;
        }

        .user-info i:hover {
          color: #ef4444;
        }

        .main-content {
          padding-top: 96px;
          padding: 2rem;
          flex: 1;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 2rem;
        }

        .form-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          font-size: 14px;
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 14px;
          color: #d1d5db;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #444;
          background-color: #1f1f1f;
          color: white;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .file-upload-container {
          position: relative;
        }

        .file-input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;
          cursor: pointer;
        }

        .file-upload-display {
          padding: 1rem;
          border: 1px dashed #555;
          background-color: #1f1f1f;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          transition: background-color 0.3s ease;
        }

        .btn-primary {
          background-color: #ef4444;
          color: white;
        }

        .btn-primary:hover {
          background-color: #dc2626;
        }

        .btn-secondary {
          background-color: #444;
          color: white;
          border: 1px solid #555;
        }

        .btn-secondary:hover {
          background-color: #555;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default LostItemForm;
