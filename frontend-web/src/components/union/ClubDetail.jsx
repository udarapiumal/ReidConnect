import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from './PostCard';
import EventCard from './EventCard';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../../css/ClubDetail.css';

const ClubDetail = () => {
  const { clubId } = useParams();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [postsPerPage] = useState(6);
  const [eventsPerPage] = useState(6);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const [currentEventsPage, setCurrentEventsPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/posts/club/${clubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (err) {
        setErrorPosts('Failed to fetch posts');
      } finally {
        setLoadingPosts(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/events/club/${clubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setErrorEvents('Failed to fetch events');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchPosts();
    fetchEvents();
  }, [clubId]);

  // Generalized handler for post status changes (activate/deactivate)
  const handlePostStatusChange = (postId, newStatus) => {
    const updatePostActive = (postsList) =>
      postsList.map((post) =>
        post.id === postId ? { ...post, active: newStatus } : post
      );

    setPosts((prevPosts) => updatePostActive(prevPosts));
    setFilteredPosts((prevFilteredPosts) => updatePostActive(prevFilteredPosts));
  };

  // Search functionality
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    if (activeTab === 'posts') {
      if (query.trim() === '') {
        setFilteredPosts(posts);
      } else {
        const filtered = posts.filter(
          (post) =>
            post.title?.toLowerCase().includes(query) ||
            post.description?.toLowerCase().includes(query) ||
            post.content?.toLowerCase().includes(query) ||
            post.author?.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);
      }
      setCurrentPostsPage(1);
    } else {
      if (query.trim() === '') {
        setFilteredEvents(events);
      } else {
        const filtered = events.filter(
          (event) =>
            event.title?.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query) ||
            event.location?.toLowerCase().includes(query)
        );
        setFilteredEvents(filtered);
      }
      setCurrentEventsPage(1);
    }
  }, [searchQuery, activeTab, posts, events]);

  // Pagination logic
  const getCurrentItems = () => {
    if (activeTab === 'posts') {
      const indexOfLastPost = currentPostsPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    } else {
      const indexOfLastEvent = currentEventsPage * eventsPerPage;
      const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
      return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    }
  };

  const getTotalPages = () => {
    if (activeTab === 'posts') {
      return Math.ceil(filteredPosts.length / postsPerPage);
    } else {
      return Math.ceil(filteredEvents.length / eventsPerPage);
    }
  };

  const getCurrentPage = () => {
    return activeTab === 'posts' ? currentPostsPage : currentEventsPage;
  };

  const setCurrentPage = (page) => {
    if (activeTab === 'posts') {
      setCurrentPostsPage(page);
    } else {
      setCurrentEventsPage(page);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Get active posts count for display
  const getActivePostsCount = () => {
    return posts.filter((post) => post.active !== false).length;
  };

  const renderPagination = () => {
    const totalPages = getTotalPages();
    const currentPage = getCurrentPage();

    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn pagination-prev"
        >
          ←
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-btn ${i === currentPage ? 'pagination-active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn pagination-next"
        >
          →
        </button>
      );
    }

    return <div className="pagination-container">{pages}</div>;
  };

  const renderContent = () => {
    const currentItems = getCurrentItems();
    const isLoading = activeTab === 'posts' ? loadingPosts : loadingEvents;
    const error = activeTab === 'posts' ? errorPosts : errorEvents;
    const totalItems = activeTab === 'posts' ? filteredPosts.length : filteredEvents.length;

    if (isLoading) {
      return (
        <div className="club-detail-loading">
          <div className="loading-spinner">Loading {activeTab}...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="club-detail-error">
          <p>{error}</p>
          <button className="back-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }

    if (totalItems === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">{activeTab === 'posts' ? '📝' : '📅'}</div>
          <h3>No {activeTab} found</h3>
          <p>
            {searchQuery
              ? `No ${activeTab} match your search "${searchQuery}"`
              : `This club doesn't have any ${activeTab} yet.`}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="content-header">
          <div className="content-stats">
            Showing {currentItems.length} of {totalItems} {activeTab}
            {searchQuery && <span className="search-info"> for "{searchQuery}"</span>}
          </div>
        </div>

        <div className={activeTab === 'posts' ? 'posts-grid' : 'events-grid'}>
          {currentItems.map((item) =>
            activeTab === 'posts' ? (
              <PostCard
                key={item.id}
                post={item}
                onPostStatusChange={handlePostStatusChange}
              />
            ) : (
              <EventCard key={item.id} event={item} />
            )
          )}
        </div>

        {renderPagination()}
      </>
    );
  };

  return (
    <div className="club-detail-container">
      {/* Header */}
      <header className="cd-header-bar">
        <div className="cd-header-left">
          <span className="cd-title-text">ReidConnect</span>
          <span className="cd-title-text cd-highlight">UnionAdmin</span>
        </div>
      </header>
      <div className="club-detail-nav">
        <button
          className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          📝 Posts ({getActivePostsCount()})
        </button>
        <button
          className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => handleTabChange('events')}
        >
          📅 Events ({events.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <i className="search-icon">🔍</i>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="club-detail-content">{renderContent()}</div>
    </div>
  );
};

export default ClubDetail;
