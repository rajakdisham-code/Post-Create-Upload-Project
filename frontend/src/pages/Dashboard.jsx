import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navigateToPosts = () => {
        navigate('/posts');
    };

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    if (!user) {
        return <div className="container"><p>No user data</p></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2>Welcome, {user.username}!</h2>
                    <div className="user-info">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> <span className="role-badge">{user.role.toUpperCase()}</span></p>
                    </div>
                </div>

                <div className="actions">
                    <button className="action-btn" onClick={navigateToPosts}>
                        Manage Posts
                    </button>
                    {user.role === 'admin' && (
                        <button className="action-btn admin-btn">
                            Admin Panel
                        </button>
                    )}
                </div>

                <div className="info-section">
                    <h3>About This Dashboard</h3>
                    <p>You are logged in as a <strong>{user.role}</strong>.</p>
                    {user.role === 'admin' && (
                        <p>You have admin access and can manage all posts and users.</p>
                    )}
                    {user.role === 'user' && (
                        <p>You can create and manage your own posts.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
