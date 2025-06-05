import React from "react";
import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useEffect } from "react";
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
    <>
      <section className="heading">
        <h1> {<FaSignInAlt />} Login</h1>
        <p>Please Log In</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              required
              type="email"
              className="form-control"
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
              className="form-control"
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
              className="btn btn-block"
            >
              {isLoading ? "Please wait" : "Login "}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
