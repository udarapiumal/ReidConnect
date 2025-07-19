import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClubCard from './ClubCard';
import '../../css/Clubgallery.css'

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
   const fetchClubs = async () => {
  try {
    const token = localStorage.getItem("token"); // adjust this if you store it elsewhere

    const response = await axios.get('http://localhost:8080/api/club', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setClubs(response.data);
  } catch (error) {
    console.error('Error fetching clubs:', error);
  }
};


    fetchClubs();
  }, []);

  return (
    <div className="gallery-container">
      {clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        clubs.map((club) => <ClubCard key={club.id} club={club} />)
      )}
    </div>
  );
};

export default ClubGallery;
