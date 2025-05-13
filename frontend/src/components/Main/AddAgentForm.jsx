import { useState } from "react";
import axios from "axios";

const AddAgentForm = ({ onAgentAdded, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8080/api/agents/add",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setForm({ name: "", email: "", mobile: "", password: "" });

      if (onAgentAdded) onAgentAdded();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating agent");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Agent</h2>
      {message && (
        <p
          style={{
            backgroundColor: "#e0ffe0",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            color: "#2e7d32",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="mobile"
          placeholder="Mobile (+countrycode...)"
          value={form.mobile}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
              marginRight: "8px",
            }}
          >
            Add Agent
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px",
              backgroundColor: "#e53935",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export default AddAgentForm;
