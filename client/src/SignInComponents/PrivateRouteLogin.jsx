import { Navigate } from 'react-router-dom';
import SignIn from "./SignIn";

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to={SignIn} />;
}
export default PrivateRoute;