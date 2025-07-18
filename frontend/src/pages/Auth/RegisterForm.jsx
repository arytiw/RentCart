import React, { useState } from "react";
import { registerUser } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    emailId: "",
    password: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        formData.username,
        formData.emailId,
        formData.password,
        formData.phoneNumber,
        formData.firstName,
        formData.lastName,
        formData.gender,
        formData.dateOfBirth,
        formData.address
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Check console for details.");
      console.error(error.response?.data || error);
    }
  };

  // Define required fields based on backend annotations
  const requiredFields = [
    "username",
    "emailId",
    "password",
    "phoneNumber",
    "firstName"
  ];

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {[
          "username",
          "emailId",
          "password",
          "phoneNumber",
          "firstName",
          "lastName",
          "gender",
          "dateOfBirth"
        ].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={requiredFields.includes(field)}
            />
          </div>
        ))}

        {["addressLine1", "addressLine2", "city", "state", "country", "postalCode"].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field}</label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData.address[field]}
              onChange={handleChange}
              // Remove `required` from optional address fields
            />
          </div>
        ))}

        <button type="submit" className="btn-submit">Register</button>
      </form>
      <Link to="/login" className="link">Already have an account? Login</Link>
    </div>
  );
};

export default RegisterForm;
