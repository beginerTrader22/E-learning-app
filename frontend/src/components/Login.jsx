import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { useLoginMutation } from "../store/api/userApi";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && window.location.pathname === "/login") {
      navigate("/my-builds");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.error) {
        toast.error(
          response.error.data?.message ||
            response.error.error ||
            "Registration failed"
        );
      } else {
        dispatch(setUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/my-builds");
        toast.success(`Welcome ${response.data.name}!`);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">
          <FaSignInAlt className="auth-icon" /> Login
        </h1>
        <p className="auth-subtitle">Please Log In</p>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              required
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={email}
              placeholder="Enter Email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              required
              type="password"
              className="form-input"
              id="password"
              name="password"
              value={password}
              placeholder="Enter Password"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Please wait..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
