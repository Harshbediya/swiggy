import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Star, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import "./Menu.css";

const Menu = () => {
  const { id } = useParams();
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({
    "Recommended": true,
    "Breads": true,
    "Curries": true
  });

  // Mock Data
  const restaurantInfo = {
    name: "Spice Junction",
    cuisines: "North Indian, Chinese, Biryani",
    location: "Koramangala, Bangalore",
    rating: 4.3,
    ratingCount: "5K+ ratings",
    deliveryTime: "25-30 mins",
    costForTwo: "₹400 for two",
    offers: [
      { code: "USE TRYNEW", desc: "20% OFF up to ₹50" },
      { code: "FLAT100", desc: "Flat ₹100 OFF above ₹599" },
      { code: "CITI50", desc: "10% OFF using Citi Card" }
    ]
  };

  const menuData = [
    {
      category: "Recommended",
      items: [
        {
          id: 101,
          name: "Paneer Butter Masala",
          price: 249,
          desc: "Cottage cheese simmered in a rich, buttery, and creamy tomato-based gravy.",
          isVeg: true,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=200&fit=crop"
        },
        {
          id: 102,
          name: "Chicken Biryani",
          price: 329,
          desc: "Aromatic basmati rice cooked with tender chicken pieces and authentic spices.",
          isVeg: false,
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop"
        },
        {
          id: 103,
          name: "Veg Fried Rice",
          price: 189,
          desc: "Wok-tossed rice with fresh vegetables and soy sauce.",
          isVeg: true,
          image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop"
        }
      ]
    },
    {
      category: "Breads",
      items: [
        {
          id: 201,
          name: "Butter Naan",
          price: 45,
          desc: "Soft and fluffy leavened bread topped with butter.",
          isVeg: true,
          image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&h=200&fit=crop"
        },
        {
          id: 202,
          name: "Garlic Naan",
          price: 55,
          desc: "Leavened bread infused with garlic and coriander.",
          isVeg: true,
          image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&h=200&fit=crop"
        },
        {
          id: 203,
          name: "Tandoori Roti",
          price: 35,
          desc: "Whole wheat bread baked in a clay oven.",
          isVeg: true,
          image: null
        }
      ]
    },
    {
      category: "Curries",
      items: [
        {
          id: 301,
          name: "Dal Makhani",
          price: 229,
          desc: "Creamy black lentils slow-cooked overnight.",
          isVeg: true,
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop"
        },
        {
          id: 302,
          name: "Butter Chicken",
          price: 349,
          desc: "Grilled chicken simmered in a spicy, aromatic, buttery and creamy tomato gravy.",
          isVeg: false,
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop"
        }
      ]
    }
  ];

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id] > 1) {
        newCart[item.id] -= 1;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = menuData.flatMap(c => c.items).find(i => i.id === parseInt(id));
    return total + (item ? item.price * qty : 0);
  }, 0);

  const filteredMenu = menuData.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchesVeg = isVegOnly ? item.isVeg : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesVeg && matchesSearch;
    })
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="menu-page">
      <div className="menu-container">
        {/* Header */}
        <div className="res-header">
          <div className="res-header-top">
            <div>
              <h1 className="res-name">{restaurantInfo.name}</h1>
              <p className="res-cuisines">{restaurantInfo.cuisines}</p>
              <p className="res-location">{restaurantInfo.location}</p>
            </div>
            <div className="res-rating-box">
              <div className="res-rating">
                <Star size={14} fill="#3d9b6d" strokeWidth={0} />
                <span>{restaurantInfo.rating}</span>
              </div>
              <div className="res-rating-count">{restaurantInfo.ratingCount}</div>
            </div>
          </div>
          <div className="res-meta">
            <div className="res-meta-item">
              <Clock size={18} />
              <span>{restaurantInfo.deliveryTime}</span>
            </div>
            <div className="res-meta-item">
              <span>{restaurantInfo.costForTwo}</span>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="offers-container">
          {restaurantInfo.offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <div className="offer-header">
                <img src="https://b.zmtcdn.com/data/o2_assets/9b18b9bd7f22d84544a357458a270d911632716604.png" width="20" alt="offer" />
                <span>{offer.code}</span>
              </div>
              <div className="offer-code">{offer.desc}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="menu-controls">
          <div className="veg-toggle" onClick={() => setIsVegOnly(!isVegOnly)}>
            <span>Veg Only</span>
            <label className="switch">
              <input type="checkbox" checked={isVegOnly} readOnly />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="menu-search">
          <Search size={18} color="#7e808c" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Menu Categories */}
        {filteredMenu.map((category, index) => (
          <div key={index} className="menu-category">
            <div className="category-header" onClick={() => toggleCategory(category.category)}>
              <span className="category-title">{category.category} ({category.items.length})</span>
              {expandedCategories[category.category] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedCategories[category.category] && (
              <div className="category-items">
                {category.items.map((item) => (
                  <div key={item.id} className="menu-item">
                    <div className="item-info">
                      <div className="item-type">
                        {item.isVeg ? (
                          <div className="veg-icon"><div className="veg-circle"></div></div>
                        ) : (
                          <div className="non-veg-icon"><div className="non-veg-triangle"></div></div>
                        )}
                      </div>
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-price">₹{item.price}</div>
                      <p className="item-desc">{item.desc}</p>
                    </div>
                    <div className="item-image-container">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="item-image" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#f2f2f2', borderRadius: '12px' }}></div>
                      )}
                      <div className="add-btn-container">
                        {cart[item.id] ? (
                          <div className="item-counter">
                            <div className="counter-btn" onClick={() => removeFromCart(item)}>-</div>
                            <span>{cart[item.id]}</span>
                            <div className="counter-btn" onClick={() => addToCart(item)}>+</div>
                          </div>
                        ) : (
                          <div className="add-btn-text" onClick={() => addToCart(item)}>ADD</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cart */}
      {cartTotalItems > 0 && (
        <div className="floating-cart">
          <div>
            <div className="cart-text">{cartTotalItems} Item{cartTotalItems > 1 ? 's' : ''} | ₹{cartTotalPrice}</div>
            <div className="cart-subtext">Extra charges may apply</div>
          </div>
          <Link to="/cart" className="view-cart" style={{ color: 'white', textDecoration: 'none' }}>
            VIEW CART <ShoppingBag size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
