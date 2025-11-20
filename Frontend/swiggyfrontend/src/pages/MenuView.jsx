import React from "react";
import "./MenuView.css";

const MenuView = () => {
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
      description: "Classic delight with 100% real mozzarella cheese.",
      price: 299,
      available: true,
    },
    {
      id: 2,
      name: "Paneer Butter Masala",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
      description: "Rich tomato gravy with tender paneer cubes.",
      price: 249,
      available: false,
    },
    {
      id: 3,
      name: "Veggie Burger",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
      description: "Crispy veg patty, lettuce, and signature sauce.",
      price: 159,
      available: true,
    },
    {
      id: 4,
      name: "Pasta Alfredo",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
      description: "Creamy pasta with garlic and parmesan cheese.",
      price: 219,
      available: true,
      
    },
     {
      id: 4,
      name: "Pasta Alfredo",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
      description: "Creamy pasta with garlic and parmesan cheese.",
      price: 219,
      available: true,
      
    },
  ];

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1>🍽️ Menu & Product View</h1>
        <p>High-quality menu with images, descriptions, prices & availability</p>
      </header>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-card ${!item.available ? "unavailable" : ""}`}
          >
            <img src={item.image} alt={item.name} />
            <div className="menu-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-bottom">
                <span className="price">₹{item.price}</span>
                {item.available ? (
                  <span className="available">Available ✅</span>
                  
                ) : (
                  <span className="not-available">Out of Stock ❌</span>
                )}
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuView;
