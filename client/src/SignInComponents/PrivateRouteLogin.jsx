import { Navigate } from 'react-router-dom';

function PrivateRoute({ isAuthenticated, children }) {
  // If authenticated, render children; otherwise redirect to /signin
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

export default PrivateRoute;