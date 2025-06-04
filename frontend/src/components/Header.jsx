import React from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/userSlice";
import { buildApi } from "../store/api/buildApi";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    // Clear the builds cache FIRST
    dispatch(buildApi.util.resetApiState());
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Create new Built</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/my-builds" className="btn">
                My Builds
              </Link>
            </li>
            <li>
              <button className="btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
