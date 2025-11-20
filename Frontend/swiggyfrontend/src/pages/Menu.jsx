import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function Menu() {
  const { id } = useParams();
  const [cart, setCart] = useState([]);

  const menuItems = [
    { id: 1, name: "Cheese Burger", price: 120 },
    { id: 2, name: "Veg Pizza", price: 250 },
    { id: 3, name: "Pasta", price: 180 }
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart`);
  };

  return (
    <div className="page">
      <h1>Restaurant #{id} Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item">
            {item.name} - ₹{item.price}
            <button onClick={() => addToCart(item)}>Add</button>
          </li>
        ))}
      </ul>
      <Link to="/cart"><button>Go to Cart</button></Link>
    </div>
  );
}

export default Menu;
