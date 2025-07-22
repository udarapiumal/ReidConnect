import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import EventCard from './EventCard';
import axios from 'axios';
import '../../css/ClubDetail.css';

const ClubDetail = () => {
  const { clubId } = useParams();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
      try {
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
        setErrorPosts('Failed to fetch posts');
      } finally {
        setLoadingPosts(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/events/club/${clubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
      } catch (err) {
        setErrorEvents('Failed to fetch events');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchPosts();
    fetchEvents();
  }, [clubId]);

  return (
    <div className="club-detail-container">
      <h2>Posts for Club {clubId}</h2>
      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : errorPosts ? (
        <p>{errorPosts}</p>
      ) : posts.length === 0 ? (
        <p>No posts found for this club.</p>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: '32px' }}>Events for Club {clubId}</h2>
      {loadingEvents ? (
        <p>Loading events...</p>
      ) : errorEvents ? (
        <p>{errorEvents}</p>
      ) : events.length === 0 ? (
        <p>No events found for this club.</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubDetail;
