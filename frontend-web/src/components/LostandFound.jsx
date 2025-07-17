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

  const form = new FormData();
  form.append("itemName", formData.itemName);
  form.append("category", formData.category);
  form.append("description", formData.description);
  form.append("location", formData.location);
  form.append("dateLost", formData.dateLost);
  form.append("image", formData.image); // file
  form.append("posterName", formData.posterName);
  form.append("contactNumber", formData.contactNumber);

  try {
    const response = await fetch("http://localhost:8080/lost/lost-items", {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      alert("Lost item post submitted successfully!");
      // Optionally reset form
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Post Lost Item</h2>

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
  );
}

const styles = {
  form: {
    maxWidth: "500px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#FF0000",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default LostItemForm;
