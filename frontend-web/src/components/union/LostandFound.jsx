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

    const token = localStorage.getItem("token"); // get JWT token
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const form = new FormData();
    form.append("itemName", formData.itemName);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("location", formData.location);
    form.append("dateLost", formData.dateLost);
    form.append("image", formData.image);
    form.append("posterName", formData.posterName);
    form.append("contactNumber", formData.contactNumber);

    try {
      const response = await fetch("http://localhost:8080/lost/lost-items", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });

      if (response.ok) {
        alert("Lost item post submitted successfully!");
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
      } else {
        const errorText = await response.text();
        alert("Error: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Post Lost Item</h2>

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <input
          type="text"
          name="location"
          placeholder="Last Seen Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="date"
          name="dateLost"
          value={formData.dateLost}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="posterName"
          placeholder="Your Name"
          value={formData.posterName}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    paddingTop: "4rem",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: "2rem 2.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "1.5rem",
    textAlign: "center",
    borderBottom: "2px solid #FF0033",
    paddingBottom: "0.5rem",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
    minHeight: "80px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#FF0033",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default LostItemForm;
