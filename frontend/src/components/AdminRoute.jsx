import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader"></div>
            </div>
        );
    }

    if (user && user.role === 'admin') {
        return <Outlet />;
    } else {
        if (!user) {
            toast.error('Please login to access admin area');
            return <Navigate to="/login" />;
        } else {
            toast.error('Access denied: Admins only');
            return <Navigate to="/" />;
        }
    }
};

export default AdminRoute;
