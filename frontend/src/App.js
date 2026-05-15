import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ==========================================
// 1. HOME PAGE (Product Grid)
// ==========================================
const Home = ({ products, addToCart }) => (
  <div>
    <div style={{ backgroundColor: '#ffddc2', padding: '40px', textAlign: 'center', margin: '20px', borderRadius: '8px', border: '1px solid #f85606' }}>
      <h2 style={{ color: '#f85606', fontSize: '32px', margin: '0 0 10px 0' }}>Mega Winter Sale Is Live!</h2>
      <p style={{ fontSize: '18px', color: '#333' }}>Up to 60% off on Electronics, Fashion, and Home Appliances.</p>
    </div>
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #f85606', display: 'inline-block', paddingBottom: '5px' }}>Just For You</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.map((product, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '100%', height: '180px', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '15px', color: '#999' }}>[Image]</div>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>{product.category}</p>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#f85606', fontWeight: 'bold' }}>৳ {product.price.toLocaleString()}</p>
            <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '10px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==========================================
// 2. CHECKOUT PAGE (Delivery Details)
// ==========================================
const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    clearCart(); 
    navigate('/success'); 
  };

  return (
    <div style={{ padding: '40px', display: 'flex', gap: '40px', justifyContent: 'center' }}>
      <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Delivery Details</h2>
        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="text" placeholder="Full Name" required style={inputStyle} />
          <input type="text" placeholder="Phone Number" required style={inputStyle} />
          <textarea placeholder="Full Delivery Address" required style={{ ...inputStyle, height: '100px' }}></textarea>
          <select style={inputStyle}>
            <option>Cash on Delivery</option>
            <option>Credit/Debit Card</option>
          </select>
          <button type="submit" style={{ padding: '15px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Confirm Order</button>
        </form>
      </div>

      <div style={{ width: '350px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h2>Order Summary</h2>
        {cart.length === 0 ? <p>Your cart is empty.</p> : 
          cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span style={{ fontSize: '14px' }}>{item.name}</span>
              <span style={{ color: '#f85606', fontWeight: 'bold' }}>৳{item.price}</span>
            </div>
          ))
        }
        <h3 style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}><span>Total:</span> <span>৳ {cartTotal.toLocaleString()}</span></h3>
      </div>
    </div>
  );
};

// ==========================================
// 3. SUCCESS PAGE (After Purchase)
// ==========================================
const OrderSuccess = () => (
  <div style={{ textAlign: 'center', padding: '100px 20px' }}>
    <h1 style={{ color: '#4CAF50', fontSize: '48px', margin: '0 0 20px 0' }}>🎉 Order Confirmed!</h1>
    <p style={{ fontSize: '18px', color: '#666' }}>Thank you for shopping with Online SuperShop.</p>
    <Link to="/" style={{ display: 'inline-block', marginTop: '30px', padding: '12px 25px', backgroundColor: '#f85606', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Continue Shopping</Link>
  </div>
);

// ==========================================
// 4. SELLER DASHBOARD
// ==========================================
const Dashboard = () => (
  <div style={{ padding: '40px' }}>
    <h2>Vendor Dashboard</h2>
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <div style={statCard}><h3>Total Sales</h3><p>৳ 45,000</p></div>
      <div style={statCard}><h3>Active Orders</h3><p>12</p></div>
      <div style={statCard}><h3>Total Products</h3><p>8</p></div>
    </div>
  </div>
);

// ==========================================
// MAIN APP CONTENT (Contains State & Sidebar)
// ==========================================
function AppContent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const backupProducts = [
    { id: 101, name: 'Samsung Galaxy S24 Ultra', description: 'Titanium frame, AI features.', price: 145000, category: 'Mobiles' },
    { id: 102, name: 'Sony WH-1000XM5 Headphones', description: 'Noise cancellation.', price: 35000, category: 'Electronics' },
    { id: 103, name: 'Nike Air Force 1', description: 'Classic white sneakers.', price: 8500, category: 'Fashion' },
    { id: 104, name: 'MacBook Air M3', description: 'Apple M3 chip.', price: 135000, category: 'Computers' },
    { id: 105, name: 'Philips Air Fryer XL', description: 'Fry with 90% less fat.', price: 12500, category: 'Home Appliances' }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => response.data && response.data.length > 0 ? setProducts(response.data) : setProducts(backupProducts))
      .catch(() => setProducts(backupProducts));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true); // Automatically open sidebar when adding an item
  };
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const clearCart = () => setCart([]);
  
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const goToCheckout = () => {
    setIsCartOpen(false); // Close sidebar
    navigate('/checkout'); // Move to checkout page
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', position: 'relative' }}>
      
      {/* GLOBAL NAVBAR (Search is back!) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#f85606', color: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>ONLINE SUPERSHOP</h1></Link>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Search in SuperShop..." style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', width: '300px' }} />
          <Link to="/dashboard" style={navButton}>Dashboard</Link>
          <button onClick={() => setIsCartOpen(true)} style={{...navButton, backgroundColor: '#0f136d', color: 'white'}}>
            🛒 Cart ({cart.length})
          </button>
        </div>
      </nav>

      {/* THE RESTORED SIDEBAR CART */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh', backgroundColor: 'white', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Your cart is empty.</p> : 
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.name}</h4>
                    <p style={{ margin: 0, color: '#f85606', fontWeight: 'bold' }}>৳ {item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))
            }
          </div>

          <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: 'auto' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 15px 0' }}><span>Total:</span> <span>৳ {cartTotal.toLocaleString()}</span></h3>
            <button onClick={goToCheckout} style={{ width: '100%', padding: '15px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Proceed to Checkout</button>
          </div>
        </div>
      )}

      {/* PAGE ROUTER */}
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </div>
  );
}

// Wrap the App in the Router so navigation works perfectly
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Quick CSS Objects
const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const navButton = { padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#f85606', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' };
const statCard = { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' };