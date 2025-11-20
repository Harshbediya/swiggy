import React from "react";
import "./css/AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-section">
      {/* Heading */}
      <h2 className="about-title">ABOUT US</h2>
      <p className="about-description">
        Swiggy is a new-age consumer-first organization offering an easy-to-use
        convenience platform, accessible through a unified app.
      </p>

      {/* Services */}
      <div className="about-services">
        <div className="service-card">
          <div className="icon-circle">
            <img src="https://png.pngtree.com/png-vector/20240718/ourmid/pngtree-burger-with-cold-drink-and-french-fries-png-image_13140128.png" alt="Food" />
          </div>
          <p>Food</p>
        </div>

        <div className="service-card">
          <div className="icon-circle">
            <img src="https://www.applyboard.com/wp-content/uploads/2023/11/groceries-300x300.png" alt="Instamart" />
          </div>
          <p>Instamart</p>
        </div>

        <div className="service-card">
          <div className="icon-circle">
            <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRnIcNVaaukMeOIwg_hGCt9aKBSZPS-Yx5uVhVDq6leJQLA6rG-" alt="Dineout" />
          </div>
          <p>Dineout</p>
        </div>
      </div>

      {/* Swiggy Logo */}
      <div className="about-logo">
        <img src="/images/swiggy-logo.png" alt="Swiggy Logo" />
      </div>
    </section>
  );
};

export default AboutUs;
