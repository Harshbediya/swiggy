import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";
import "./OrderTracking.css"; // Assuming you might want some styles

export default function OrderTracking() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}/`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };
        fetchOrder();
        const interval = setInterval(fetchOrder, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [id]);

    if (!order) return <div>Loading Order Status...</div>;

    const steps = [
        { status: "PENDING", label: "Order Placed", icon: CheckCircle },
        { status: "PREPARING", label: "Preparing", icon: Clock },
        { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
        { status: "DELIVERED", label: "Delivered", icon: Package },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="tracking-container">
            <h1>Order #{order.id}</h1>
            <div className="tracking-status">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    return (
                        <div key={step.status} className={`tracking-step ${isActive ? "active" : ""}`}>
                            <div className="step-icon">
                                <Icon size={24} />
                            </div>
                            <div className="step-label">{step.label}</div>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    );
                })}
            </div>
            <div className="order-details">
                <h3>Items</h3>
                <ul>
                    {order.items.map((item) => (
                        <li key={item.id}>
                            {item.quantity}x {item.menu_item.name} - ₹{item.price}
                        </li>
                    ))}
                </ul>
                <h3>Total: ₹{order.total_amount}</h3>
            </div>
        </div>
    );
}
