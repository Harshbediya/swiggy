import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // optional: put navbar-specific CSS here

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img 
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/static-assets/images/swiggy_logo_white.png" 
            alt="FoodApp Logo" 
            className="logo-img"
          />
        </Link>
      </div>

      {/* Links */}
      <div className="nav-links">
        <Link to="/AboutUs">Swiggy Corporate</Link>
        <Link to="/cart">Partner with us</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}

export default Navbar;
