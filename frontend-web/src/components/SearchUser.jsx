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
    try {
      const response = await axios.get(`http://localhost:8080/users/search`, {
        params: { regNumber }
      });
      setUser(response.data);
      setError('');
    } catch (err) {
      setUser(null);
      setError('User not found or error occurred');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Search Student by Registration Number</h2>
      <input
        type="text"
        placeholder="Enter student registration number"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '8px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Search
      </button>

      {user && (
        <div style={{ marginTop: '20px' }}>
          <h3>User Found:</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
}

export default SearchUser;
