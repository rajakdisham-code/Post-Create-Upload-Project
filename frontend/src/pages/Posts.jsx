import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Posts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [myPostIds, setMyPostIds] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        caption: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchCurrentUser(token);
        fetchMyPosts(token);
        fetchPosts(token);
    }, [navigate]);

    const fetchCurrentUser = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (err) {
            // Keep localStorage user as fallback when /me fails.
        }
    };

    const fetchPosts = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/posts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setPosts(response.data.posts);
            }
        } catch (err) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPosts = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/my-posts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && Array.isArray(response.data.posts)) {
                setMyPostIds(response.data.posts.map((post) => String(post._id)));
            }
        } catch (err) {
            // Keep fallback owner checks when my-posts request fails.
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const token = localStorage.getItem('token');

        try {
            if (editingId) {
                // Update post
                const response = await axios.put(
                    `http://localhost:3000/api/v1/posts/${editingId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess('Post updated successfully!');
                    setFormData({ title: '', description: '', caption: '' });
                    setEditingId(null);
                    setShowForm(false);
                    fetchPosts(token);
                    fetchMyPosts(token);
                }
            } else {
                // Create post
                const createPayload = new FormData();
                createPayload.append('title', formData.title);
                createPayload.append('description', formData.description);
                createPayload.append('caption', formData.caption);
                if (imageFile) {
                    createPayload.append('image', imageFile);
                }

                const response = await axios.post(
                    'http://localhost:3000/api/v1/posts',
                    createPayload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess('Post created successfully!');
                    setFormData({ title: '', description: '', caption: '' });
                    setImageFile(null);
                    setShowForm(false);
                    fetchPosts(token);
                    fetchMyPosts(token);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post');
        }
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.title,
            description: post.description,
            caption: post.caption
        });
        setEditingId(post._id);
        setShowForm(true);
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/v1/posts/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Post deleted successfully!');
                fetchPosts(token);
                fetchMyPosts(token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ title: '', description: '', caption: '' });
        setImageFile(null);
    };

    const canEditDelete = (post) => {
        if (myPostIds.includes(String(post._id))) {
            return true;
        }

        if (!user) return false;

        const postOwnerId = typeof post.userId === 'object'
            ? (post.userId?._id || post.userId?.id)
            : post.userId;

        const currentUserId = user._id || user.id;
        const isOwnerById = String(postOwnerId || '') === String(currentUserId || '');
        const isOwnerByEmail = post.createdBy && user.email && post.createdBy === user.email;
        const isOwnerByUsername = post.createdBy && user.username && post.createdBy === user.username;

        return isOwnerById || isOwnerByEmail || isOwnerByUsername || user.role === 'admin';
    };

    if (loading) {
        return <div className="posts-container"><p>Loading posts...</p></div>;
    }

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>Posts</h1>
                <div className="header-buttons">
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Create Post'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {showForm && (
                <form className="post-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Edit Post' : 'Create New Post'}</h2>
                    
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            placeholder="Enter post title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Enter post description"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Caption:</label>
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleFormChange}
                            placeholder="Enter post caption (optional)"
                        />
                    </div>

                    {!editingId && (
                        <div className="form-group">
                            <label>Image (optional):</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    <div className="form-buttons">
                        <button type="submit" className="btn btn-success">
                            {editingId ? 'Update Post' : 'Create Post'}
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="posts-list">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <h3>{post.title}</h3>
                                <span className="post-author">By: {post.createdBy}</span>
                            </div>
                            
                            <p className="post-description">{post.description}</p>

                            {post.image && (
                                <img className="post-image" src={post.image} alt={post.title} />
                            )}
                            
                            {post.caption && (
                                <p className="post-caption">Caption: {post.caption}</p>
                            )}

                            <div className="post-meta">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="post-actions">
                                {canEditDelete(post) && (
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => handleEdit(post)}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="btn btn-delete"
                                    onClick={() => handleDelete(post._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-posts">No posts available. Create one!</p>
                )}
            </div>
        </div>
    );
};

export default Posts;
