// components/RequireAuth.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
