import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Search } from "lucide-react";
import "./Menu.css";
import api from "../api";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const resRestaurant = await api.get(`/restaurants/${id}/`);
        setRestaurant(resRestaurant.data);
        setMenuItems(resRestaurant.data.menu_items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchRestaurantAndMenu();
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  const filteredItems = menuItems.filter((item) => {
    if (isVegOnly && !item.is_veg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="menu-container">
      <div className="menu-header">
        <div className="menu-header-content">
          <div className="menu-breadcrumb">Home / {restaurant.city || "City"} / {restaurant.name}</div>

          <div className="restaurant-info-card">
            <div className="res-details">
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {restaurant.name}
              </motion.h1>
              <div className="res-meta">
                <span>{restaurant.cuisine}</span>
                <span>{restaurant.price_tier}</span>
                <span>{restaurant.distance_km} km</span>
              </div>
              <div className="res-badges">
                <div className="res-rating">
                  <Star size={16} fill="white" /> {restaurant.rating}
                </div>
                <div className="res-delivery">
                  <Clock size={16} /> {restaurant.delivery_time_mins} mins
                </div>
              </div>
            </div>

            <div className="res-offers">
              <div className="offer-box">
                <div className="offer-title">20% OFF</div>
                <div className="offer-desc">Up to ₹50</div>
              </div>
              <div className="offer-box">
                <div className="offer-title">Free Delivery</div>
                <div className="offer-desc">On orders above ₹199</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-main">
        <div className="menu-controls">
          <div className="veg-toggle">
            <label className="switch">
              <input type="checkbox" checked={isVegOnly} onChange={() => setIsVegOnly(!isVegOnly)} />
              <span className="slider round"></span>
            </label>
            <span>Veg Only</span>
          </div>
          <div className="menu-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="menu-list">
          <h2 className="category-title">Recommended ({filteredItems.length})</h2>
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="item-info">
                <div className={`item-type ${item.is_veg ? "veg" : "non-veg"}`}>
                  {item.is_veg ? "VEG" : "NON-VEG"}
                </div>
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">₹{item.price}</div>
                <p className="item-desc">{item.description}</p>
              </div>
              <div className="item-image-container">
                <div className="item-image-placeholder"></div>
                <button className="add-btn" onClick={() => addToCart(item)}>ADD</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
