import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import axios from 'axios';
import '../../css/ClubDetail.css';

const ClubDetail = () => {
  const { clubId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/api/posts/club/${clubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
        
        
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [clubId]);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  if (posts.length === 0) return <p>No posts found for this club.</p>;

  return (
    <div className="club-detail-container">
      <h2>Posts for Club {clubId}</h2>
      <div className="posts-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ClubDetail;
