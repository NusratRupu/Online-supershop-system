import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ==========================================
// 1. HOME PAGE
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
            
            {/* THIS IS THE MAGIC IMAGE TAG */}
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} 
              alt={product.name} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} 
            />

            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>{product.category}</p>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#f85606', fontWeight: 'bold' }}>৳ {product.price ? product.price.toLocaleString() : '0'}</p>
            <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '10px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==========================================
// 2. CHECKOUT PAGE
// ==========================================
const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

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
// 3. SUCCESS PAGE
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
// MAIN APP CONTENT
// ==========================================
function AppContent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

 const backupProducts = [
    // --- TECH & GADGETS ---
    { 
      id: 101, name: 'Samsung Galaxy S24 Ultra', description: 'Titanium frame, 256GB, AI features.', price: 145000, category: 'Mobiles',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80' 
    },
    { 
      id: 102, name: 'Sony WH-1000XM5', description: 'Industry leading noise cancellation.', price: 35000, category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' 
    },
    { 
      id: 103, name: 'MacBook Air M3', description: 'Apple M3 chip, 8GB RAM, 256GB SSD.', price: 135000, category: 'Computers',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' 
    },
    { 
      id: 104, name: 'Logitech G Pro X Wireless', description: 'Ultra-lightweight gaming mouse.', price: 12500, category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80' 
    },
    { 
      id: 105, name: 'Apple Watch Series 9', description: 'Advanced health features, GPS.', price: 45000, category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80' 
    },

    // --- FASHION & LIFESTYLE ---
    { 
      id: 106, name: 'Nike Air Force 1', description: 'Classic white leather sneakers.', price: 8500, category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80' 
    },
    { 
      id: 107, name: 'Men’s Vintage Denim Jacket', description: 'Classic blue wash, slim fit.', price: 2200, category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0eb?w=500&q=80' 
    },
    { 
      id: 108, name: 'Polarized Aviator Sunglasses', description: 'UV400 protection, metal frame.', price: 1500, category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' 
    },
    { 
      id: 109, name: 'Travel Duffle Backpack', description: 'Waterproof, 40L capacity.', price: 3200, category: 'Travel',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' 
    },
    { 
      id: 110, name: 'Casio G-Shock', description: 'Shock resistant, water resistant.', price: 6500, category: 'Watches',
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80' 
    },

    // --- HOME & BEAUTY ---
    { 
      id: 111, name: 'Philips Air Fryer XL', description: 'Fry with 90% less fat.', price: 12500, category: 'Home Appliances',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' 
    },
    { 
      id: 112, name: 'Vitamin C Face Serum', description: 'Brightening and anti-aging skincare.', price: 850, category: 'Beauty',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' 
    },
    { 
      id: 113, name: 'Ergonomic Office Chair', description: 'Lumbar support, breathable mesh.', price: 8500, category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' 
    },
    { 
      id: 114, name: 'Stainless Steel Water Bottle', description: 'Keeps drinks cold for 24 hours.', price: 1200, category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80' 
    },
    { 
      id: 115, name: 'LED Desk Lamp', description: 'Dimmable, eye-caring reading light.', price: 1800, category: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' 
    }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => response.data && response.data.length > 0 ? setProducts(response.data) : setProducts(backupProducts))
      .catch(() => setProducts(backupProducts));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true); 
  };
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const clearCart = () => setCart([]);
  
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

  const goToCheckout = () => {
    setIsCartOpen(false); 
    navigate('/checkout'); 
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', position: 'relative' }}>
      
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
                    <p style={{ margin: 0, color: '#f85606', fontWeight: 'bold' }}>৳ {item.price}</p>
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

      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const navButton = { padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#f85606', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' };
const statCard = { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' };