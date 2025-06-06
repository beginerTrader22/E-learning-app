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
    dispatch(buildApi.util.resetApiState());
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <Link to="/" className="logo-link">
          Krijo nje Kompiuter te Ri
        </Link>
      </div>
      <h2>Ndertuesi i kompiuterave</h2>
      <nav className="header-nav">
        <ul className="nav-list">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/my-builds" className="nav-link">
                  Kompiuterat e Mi
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" /> Dil
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <FaSignInAlt className="nav-icon" /> Hyr
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  <FaUser className="nav-icon" /> Regjistrohu
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
