import React, { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    userId: "",
  });

  // Fetch existing items from backend
  const fetchItems = () => {
    fetch("http://localhost:9090/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchItems(); // on component mount
  }, []);

  // Update form data when inputs change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new item to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:9090/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post item");
        return res.json();
      })
      .then(() => {
        setFormData({ title: "", price: "", description: "", userId: "" });
        fetchItems();
      })
      .catch((err) => console.error("POST error:", err));
  };

  // Render in pure JavaScript (React.createElement style)
  return React.createElement(
    "div",
    { style: { padding: "2rem", fontFamily: "sans-serif" } },
    React.createElement("h1", null, "RentCart - Add & View Items"),
    React.createElement(
      "form",
      { onSubmit: handleSubmit, style: { marginBottom: "2rem" } },
      ...["title", "price", "description", "userId"].map((field, idx) =>
        React.createElement("input", {
          key: idx,
          name: field,
          placeholder: field.charAt(0).toUpperCase() + field.slice(1),
          value: formData[field],
          onChange: handleChange,
          style: {
            marginRight: "1rem",
            marginBottom: "0.5rem",
            display: "block",
            padding: "0.5rem",
            width: "300px",
          },
        })
      ),
      React.createElement(
        "button",
        { type: "submit", style: { padding: "0.5rem 1rem" } },
        "Add Item"
      )
    ),
    React.createElement("h2", null, "Items List"),
    ...items.map((item, idx) =>
      React.createElement(
        "div",
        {
          key: idx,
          style: {
            padding: "0.5rem",
            marginBottom: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          },
        },
        `Title: ${item.title} | ₹${item.price} | ${item.description}`
      )
    )
  );
}

export default App;
