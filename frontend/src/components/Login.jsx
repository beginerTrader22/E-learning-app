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
            "Regjistrimi Deshtoi"
        );
      } else {
        dispatch(setUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/my-builds");
        toast.success(`Mire se vini ${response.data.name}!`);
      }
    } catch (err) {
      console.error("Hyrja Deshtoi", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">
          <FaSignInAlt className="auth-icon" /> Hyr
        </h1>
        <p className="auth-subtitle">Ju lutem logohuni per te bere veprime</p>
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
              placeholder="Vendos email"
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
              placeholder="Vendos password"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? "Ju lutem prisni..." : "Hyr"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
