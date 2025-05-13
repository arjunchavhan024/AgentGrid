import React, { useState } from "react";
import axios from "axios";

const CsvUploader = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (uploadedFile && allowedTypes.includes(uploadedFile.type)) {
      setFile(uploadedFile);
      setMessage("");
    } else {
      setMessage("Only .csv, .xls, and .xlsx files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Upload successful!");
    } catch (err) {
      setMessage("Upload failed. " + (err.response?.data?.message || ""));
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "20px",
      marginBottom: "20px",
      color: "#333",
    },
    input: {
      marginBottom: "15px",
      display: "block",
      width: "100%",
    },
    button: {
      padding: "10px 15px",
      margin: "5px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    uploadButton: {
      backgroundColor: "#007bff",
      color: "#fff",
    },
    closeButton: {
      backgroundColor: "#E53935",
      color: "#fff",
    },
    message: {
      marginTop: "15px",
      fontWeight: "bold",
      color: "#E53935",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload CSV</h2>
      <input type="file" style={styles.input} onChange={handleFileChange} />
      <button
        style={{ ...styles.button, ...styles.uploadButton }}
        onClick={handleUpload}
      >
        Upload
      </button>
      <button
        style={{ ...styles.button, ...styles.closeButton }}
        onClick={onClose}
      >
        Close
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default CsvUploader;
