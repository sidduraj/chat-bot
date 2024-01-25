import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TOKEN_NAME } from './const';

const PrivateRoute = ({ children }: { children: any }) => {
  const accessToken = localStorage.getItem(TOKEN_NAME);

  // Check if there's no access token
  if (!accessToken) {
    // Redirect to the login page if there's no valid access token
    return <Navigate to="/login" />;
  }

  // Render the protected content or child components
  return children;
};

export default PrivateRoute;
