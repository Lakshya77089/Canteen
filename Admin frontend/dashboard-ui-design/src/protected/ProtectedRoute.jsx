import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
