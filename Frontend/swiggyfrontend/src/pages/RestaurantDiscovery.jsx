import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./RestaurantDiscovery.css";
import api from "../api";

const CUISINES = ["Indian", "Chinese", "Italian", "Continental", "South Indian", "Desserts"];
const DIETARY = ["Vegetarian", "Vegan", "Gluten-Free", "Egg-Free"];
const PRICE_TIERS = ["₹", "₹₹", "₹₹₹"];

export default function RestaurantDiscovery() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState(new Set());
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [priceTier, setPriceTier] = useState(new Set());
  const [deliveryMax, setDeliveryMax] = useState(60);
  const [selectedDietary, setSelectedDietary] = useState(new Set());
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);
  const [membershipOnly, setMembershipOnly] = useState(false);
  const [showValueMeals, setShowValueMeals] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/restaurants/");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const toggleSet = (set, setter, value) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCuisines.size && !selectedCuisines.has(r.cuisine)) return false;
      if (r.rating < minRating) return false;
      if (r.distance_km > maxDistance) return false;
      if (priceTier.size && !priceTier.has(r.price_tier)) return false;
      if (r.delivery_time_mins > deliveryMax) return false;
      if (selectedDietary.size) {
        // Assuming dietary_options is an array of strings
        for (let d of selectedDietary) if (!r.dietary_options.includes(d)) return false;
      }
      if (showPromotionsOnly && (!r.promotions || r.promotions.length === 0)) return false;
      if (membershipOnly && !r.is_member_exclusive) return false;
      if (showValueMeals && !r.is_value_meal) return false;
      return true;
    });
  }, [
    restaurants,
    query,
    selectedCuisines,
    minRating,
    maxDistance,
    priceTier,
    deliveryMax,
    selectedDietary,
    showPromotionsOnly,
    membershipOnly,
    showValueMeals,
  ]);

  return (
    <div className="rd-container">
      <div className="rd-inner">
        <header className="rd-header">
          <div>
            <h1 className="rd-title">Restaurant Discovery</h1>
            <div className="rd-sub">Browse by cuisine, rating, distance — find food you’ll love</div>
          </div>

          <div className="rd-header-right">
            <div className="rd-search">
              <Search className="rd-search-icon" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes"
              />
            </div>
            <div className="rd-membership">Membership • Save with Swiggy+ perks</div>
          </div>
        </header>

        <div className="rd-banner">
          <div>
            <strong>Exclusive:</strong> Members get free delivery on orders above ₹199 + extra discounts.
          </div>
          <button onClick={() => alert("Open membership modal")} className="rd-btn primary pulse">
            Join Swiggy+
          </button>
        </div>

        <main className="rd-main">
          {/* FILTER SIDEBAR */}
          <aside className="rd-filters">
            <h3>Filters</h3>

            <label>Cuisines</label>
            <div className="rd-cuisines">
              {CUISINES.map((c) => (
                <div
                  key={c}
                  className={`rd-chip ${selectedCuisines.has(c) ? "active" : ""}`}
                  onClick={() => toggleSet(selectedCuisines, setSelectedCuisines, c)}
                >
                  {c}
                </div>
              ))}
            </div>

            <label>Min Rating: {minRating.toFixed(1)}</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
            />

            <label>Max Distance (km): {maxDistance}</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            />

            <label>Price</label>
            <div className="rd-price">
              {PRICE_TIERS.map((p) => (
                <div
                  key={p}
                  className={`rd-chip ${priceTier.has(p) ? "active" : ""}`}
                  onClick={() => toggleSet(priceTier, setPriceTier, p)}
                >
                  {p}
                </div>
              ))}
            </div>

            <label>Delivery time (max mins): {deliveryMax}</label>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={deliveryMax}
              onChange={(e) => setDeliveryMax(parseInt(e.target.value))}
            />

            <label>Dietary preferences</label>
            <div className="rd-dietary">
              {DIETARY.map((d) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    checked={selectedDietary.has(d)}
                    onChange={() => toggleSet(selectedDietary, setSelectedDietary, d)}
                  />{" "}
                  {d}
                </label>
              ))}
            </div>

            <label>
              <input
                type="checkbox"
                checked={showPromotionsOnly}
                onChange={() => setShowPromotionsOnly((s) => !s)}
              />{" "}
              Promotions only
            </label>

            <label>
              <input
                type="checkbox"
                checked={membershipOnly}
                onChange={() => setMembershipOnly((s) => !s)}
              />{" "}
              Membership exclusive
            </label>

            <label>
              <input
                type="checkbox"
                checked={showValueMeals}
                onChange={() => setShowValueMeals((s) => !s)}
              />{" "}
              Value meals
            </label>

            <div className="rd-actions">
              <button
                className="rd-btn"
                onClick={() => {
                  setSelectedCuisines(new Set());
                  setPriceTier(new Set());
                  setSelectedDietary(new Set());
                  setMinRating(0);
                  setMaxDistance(10);
                  setDeliveryMax(60);
                  setShowPromotionsOnly(false);
                  setMembershipOnly(false);
                  setShowValueMeals(false);
                  setQuery("");
                }}
              >
                Reset
              </button>
              <button className="rd-btn primary">Apply</button>
            </div>
          </aside>

          {/* RESULTS */}
          <section>
            <div className="rd-resultsTop">
              <div>Showing {filtered.length} results</div>
              <select>
                <option>Recommended</option>
                <option>Rating High → Low</option>
                <option>Distance Near → Far</option>
              </select>
            </div>

            <div className="rd-grid">
              {filtered.map((r) => (
                <motion.article key={r.id} whileHover={{ translateY: -6 }} className="rd-card">
                  {r.promotions && r.promotions.length > 0 && <div className="rd-promo">{r.promotions[0]}</div>}
                  {r.is_member_exclusive && <div className="rd-member">Member</div>}

                  <div className="rd-card-body">
                    <div className="rd-thumb">Img</div>
                    <div>
                      <h4>{r.name}</h4>
                      <p>
                        {r.cuisine} • {r.price_tier} • {r.distance_km} km
                      </p>
                      <div className="rd-meta">
                        ⭐ {r.rating} • {r.delivery_time_mins} mins
                      </div>

                      <div className="rd-card-actions">
                        <Link to={`/menu/${r.id}`} className="rd-btn">View Menu </Link>
                        <button className="rd-btn primary">Order Now</button>
                      </div>

                      {r.is_value_meal && <div className="rd-value">Value meal available</div>}
                    </div>
                  </div>
                </motion.article>
              ))}
              {filtered.length === 0 && <div className="rd-empty">No restaurants match your filters.</div>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
