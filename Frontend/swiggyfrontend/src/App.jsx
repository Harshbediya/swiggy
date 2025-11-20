import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";
import RestaurantDiscovery from "./pages/RestaurantDiscovery";
import MenuView from "./pages/MenuView";
import RestaurantDetails from "./pages/RestaurantDetails";

import "./styles.css";

import { setAuthToken } from "./api";
import Signup from "./pages/Signup";
function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/menu/:id" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/RestaurantDiscovery" element={<RestaurantDiscovery />} />
           <Route path="/menu" element={<MenuView />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
