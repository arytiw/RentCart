import React, { useEffect, useState } from 'react';

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/items")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Failed to fetch items", err));
  }, []);

  return (
    <div>
      <h2>All Items</h2>
      {items.map((item) => (
        <div key={item.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>Price: ₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ItemList;
