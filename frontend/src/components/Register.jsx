import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../store/slices/userSlice";
import { useRegisterMutation } from "../store/api/userApi";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Pasuoret nuk jane te njejte");
    } else {
      const response = await register(formData);
      if (response.error) {
        toast.error(
          response.error.data?.message ||
            response.error.error ||
            "Regjistrimi deshtoi"
        );
      } else {
        dispatch(setUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
        toast.success("Regjistrimi u krye me sukses");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">
          <FaUser className="auth-icon" /> Regjistrohu
        </h1>
        <p className="auth-subtitle">Ju lutem krijoni nje profil/llogari</p>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              value={name}
              placeholder="Vendos emrin"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={email}
              placeholder="Vendos emailin"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              id="password"
              name="password"
              value={password}
              placeholder="Vendos pasuordin"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Konfirmo pasourdin e vendosur lart"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Duke procesuar.." : "Regjistrohu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
