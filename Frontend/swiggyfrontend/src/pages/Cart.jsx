import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Cart() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      // Assuming the first item's restaurant is the restaurant for the order
      // In a real app, we should enforce single restaurant cart or handle split orders
      const restaurantId = cart[0].restaurant;

      const orderData = {
        restaurant: restaurantId,
        total_amount: total,
        items_in: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post("/orders/", orderData);
      clearCart();
      navigate(`/orders/${response.data.id}`); // Navigate to tracking page
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <Link to="/RestaurantDiscovery" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
            <div className="cart-item-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="cart-item-total">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ₹{total}</h3>
        <button className="btn-checkout" onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}
