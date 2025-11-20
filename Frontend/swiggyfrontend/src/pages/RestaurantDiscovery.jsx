import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./RestaurantDiscovery.css";

const CUISINES = ["Indian", "Chinese", "Italian", "Continental", "South Indian", "Desserts"];
const DIETARY = ["Vegetarian", "Vegan", "Gluten-Free", "Egg-Free"];
const PRICE_TIERS = ["₹", "₹₹", "₹₹₹"];

const MOCK_RESTAURANTS = [
  { id: 1, name: "Spice Junction", cuisine: "Indian", rating: 4.4, distanceKm: 1.2, priceTier: "₹", deliveryMins: 25, dietary: ["Vegetarian"], promotions: ["20% OFF"], isMemberExclusive: false, isValueMeal: true },
  { id: 2, name: "Wok & Roll", cuisine: "Chinese", rating: 4.2, distanceKm: 3.3, priceTier: "₹₹", deliveryMins: 35, dietary: ["Egg-Free"], promotions: [], isMemberExclusive: true, isValueMeal: false },
  { id: 3, name: "La Pasta", cuisine: "Italian", rating: 4.7, distanceKm: 2.0, priceTier: "₹₹₹", deliveryMins: 45, dietary: [], promotions: ["Free Dessert"], isMemberExclusive: true, isValueMeal: true },
  { id: 4, name: "Dosa Delight", cuisine: "South Indian", rating: 4.1, distanceKm: 0.8, priceTier: "₹", deliveryMins: 18, dietary: ["Vegetarian"], promotions: [], isMemberExclusive: false, isValueMeal: false },
  { id: 5, name: "Sweet Tooth", cuisine: "Desserts", rating: 4.6, distanceKm: 4.5, priceTier: "₹", deliveryMins: 40, dietary: ["Vegetarian", "Gluten-Free"], promotions: ["Buy 1 Get 1"], isMemberExclusive: false, isValueMeal: false },
  { id: 6, name: "Tandoori House", cuisine: "Indian", rating: 4.3, distanceKm: 1.5, priceTier: "₹₹", deliveryMins: 30, dietary: ["Vegetarian"], promotions: ["10% OFF"], isMemberExclusive: false, isValueMeal: false },
  { id: 7, name: "Urban Café", cuisine: "Continental", rating: 4.5, distanceKm: 2.8, priceTier: "₹₹", deliveryMins: 40, dietary: ["Vegan"], promotions: [], isMemberExclusive: true, isValueMeal: true },
];

export default function RestaurantDiscovery() {
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

  const toggleSet = (set, setter, value) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    return MOCK_RESTAURANTS.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCuisines.size && !selectedCuisines.has(r.cuisine)) return false;
      if (r.rating < minRating) return false;
      if (r.distanceKm > maxDistance) return false;
      if (priceTier.size && !priceTier.has(r.priceTier)) return false;
      if (r.deliveryMins > deliveryMax) return false;
      if (selectedDietary.size) {
        for (let d of selectedDietary) if (!r.dietary.includes(d)) return false;
      }
      if (showPromotionsOnly && (!r.promotions || r.promotions.length === 0)) return false;
      if (membershipOnly && !r.isMemberExclusive) return false;
      if (showValueMeals && !r.isValueMeal) return false;
      return true;
    });
  }, [
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
                  {r.promotions.length > 0 && <div className="rd-promo">{r.promotions[0]}</div>}
                  {r.isMemberExclusive && <div className="rd-member">Member</div>}

                  <div className="rd-card-body">
                    <div className="rd-thumb">Img</div>
                    <div>
                      <h4>{r.name}</h4>
                      <p>
                        {r.cuisine} • {r.priceTier} • {r.distanceKm} km
                      </p>
                      <div className="rd-meta">
                        ⭐ {r.rating} • {r.deliveryMins} mins
                      </div>

                      <div className="rd-card-actions">
                        <Link to="/menu" className="rd-btn">View Menu </Link>
                        <button className="rd-btn primary">Order Now</button>
                      </div>

                      {r.isValueMeal && <div className="rd-value">Value meal available</div>}
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
