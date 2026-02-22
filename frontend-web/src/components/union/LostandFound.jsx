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

    // Validation (image is NOT required)
    if (
      !itemName.trim() ||
      !category.trim() ||
      !description.trim() ||
      !location.trim() ||
      !dateLost ||
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

      // Only append image if it exists
      if (image) {
        formPayload.append("image", image);
      }

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

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const categories = [
    "Electronics", "Clothing", "Accessories", "Books",
    "Documents", "Keys", "Bags", "Jewelry",
    "Sports Equipment", "Other"
  ];

  return (
    <div className="app-container">
      <header className="lf-form-header-bar">
        <div className="lf-form-header-left">
          <span className="lf-form-title">ReidConnect</span>
          <span className="lf-form-title lf-form-highlight">UnionAdmin</span>
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
                  max={getTodayDate()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image (Optional)</label>
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

      <style>{`
        .app-container {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          min-height: 100vh;
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .lf-form-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1001;
          background: rgba(20, 20, 20, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .lf-form-header-left {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .lf-form-title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .lf-form-highlight {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-content {
          padding-top: 100px;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-bottom: 2rem;
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .form-container {
          max-width: 800px;
          width: 100%;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
        }

        .form-header h1 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .form-header p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 28px;
        }

        .form-group {
          margin-bottom: 20px;
          flex: 1;
        }

        .form-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .form-row .form-group {
          flex: 1;
          min-width: 200px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 400;
          transition: all 0.3s ease;
          outline: none;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-select option {
          background: #1a1a1a;
          color: #ffffff;
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
          padding: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .file-upload-display:hover {
          border-color: rgba(249, 115, 22, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-icon {
          margin-right: 8px;
          font-size: 18px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-primary,
        .btn-secondary {
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: none;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 80px 12px 20px;
          }

          .form-container {
            padding: 20px;
          }

          .form-row {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default LostItemForm;