import React, { useState } from 'react';
import axios from 'axios';

function SearchUser() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const extractRegNumber = (email) => {
    return email.split('@')[0];
  };

 const handleSearch = async () => {
  const regNumber = extractRegNumber(email.trim());

  const token = localStorage.getItem("token"); // get the JWT token

  if (!token) {
    alert("Please log in first");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/users/search`, {
      params: { regNumber },
      headers: {
        Authorization: `Bearer ${token}`,  // <-- add token here
      },
    });
    setUser(response.data);
    setError('');
  } catch (err) {
    setUser(null);
    setError('User not found or error occurred');
  }
};


  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Search Student</h2>

        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter student registration number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            Search
          </button>
        </div>

        {user && (
          <div style={styles.resultBox}>
            <h3 style={styles.resultTitle}>User Found:</h3>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
  backgroundColor: '#f4f4f4',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '4rem', // ← this moves the card higher
},
  container: {
    backgroundColor: '#ffffff',
    padding: '2rem 2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '1.5rem',
    textAlign: 'center',
    borderBottom: '2px solid #FF0033',
    paddingBottom: '0.5rem'
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  input: {
    padding: '12px',
    flex: '1',
    minWidth: '250px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#FF0033',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  resultBox: {
    backgroundColor: '#fdfdfd',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #eee',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  resultTitle: {
    color: '#FF0033',
    marginBottom: '1rem'
  },
  error: {
    color: '#FF0033',
    marginTop: '1rem',
    textAlign: 'center'
  }
};

export default SearchUser;
