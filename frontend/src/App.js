import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ==========================================
// 1. AUTHENTICATION PAGES
// ==========================================
const Login = ({ setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      setRole(res.data.user.role);
      alert(`Welcome back! Logged in as ${res.data.user.role}`);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || "Login Failed!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', minHeight: '60vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', height: 'fit-content' }}>
        <h2 style={{ textAlign: 'center', color: '#f85606', marginBottom: '20px' }}>Login to SuperShop</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" style={primaryButton}>Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>Don't have an account? <Link to="/register" style={{ color: '#f85606' }}>Register here</Link></p>
      </div>
    </div>
  );
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', { name, email, password, role });
      alert("Account created successfully! Please login.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || "Registration Failed!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', minHeight: '60vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px', height: 'fit-content' }}>
        <h2 style={{ textAlign: 'center', color: '#f85606', marginBottom: '20px' }}>Create an Account</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>I want to register as a:</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
            <option value="buyer">Customer (Buy Products)</option>
            <option value="seller">Vendor (Sell Products)</option>
          </select>
          <button type="submit" style={primaryButton}>Register</button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. HOME PAGE 
// ==========================================
const Home = ({ products, addToCart }) => (
  <div style={{ minHeight: '80vh' }}>
    <div style={{ backgroundColor: '#ffddc2', padding: '40px', textAlign: 'center', margin: '20px', borderRadius: '8px', border: '1px solid #f85606' }}>
      <h2 style={{ color: '#f85606', fontSize: '32px', margin: '0 0 10px 0' }}>Mega Winter Sale Is Live!</h2>
      <p style={{ fontSize: '18px', color: '#333' }}>Up to 60% off on Electronics, Fashion, and Home Appliances.</p>
    </div>
    <div style={{ padding: '0 40px 40px 40px' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #f85606', display: 'inline-block', paddingBottom: '5px' }}>Just For You</h2>
      
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>Loading products...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {products.map((product, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              
              {/* IMAGE FIX: Pulls from backend uploads folder OR Unsplash */}
              <img 
                src={product.image ? `http://localhost:5000${product.image}` : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} 
              />

              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>{product.category}</p>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#f85606', fontWeight: 'bold' }}>৳ {product.price ? product.price.toLocaleString() : '0'}</p>
              <button onClick={() => addToCart(product)} style={{...primaryButton, marginTop: 'auto'}}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ==========================================
// 3. CHECKOUT & SUCCESS PAGES
// ==========================================
const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);
  const handleCheckout = (e) => { e.preventDefault(); clearCart(); navigate('/success'); };
  
  return (
    <div style={{ padding: '40px', display: 'flex', gap: '40px', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Delivery Details</h2>
        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="text" placeholder="Full Name" required style={inputStyle} />
          <input type="text" placeholder="Phone Number" required style={inputStyle} />
          <textarea placeholder="Full Delivery Address" required style={{ ...inputStyle, height: '100px' }}></textarea>
          <select style={inputStyle}><option>Cash on Delivery</option><option>Credit/Debit Card</option></select>
          <button type="submit" style={primaryButton}>Confirm Order</button>
        </form>
      </div>
      <div style={{ width: '350px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
        <h2>Order Summary</h2>
        {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((item, index) => (<div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}><span style={{ fontSize: '14px' }}>{item.name}</span><span style={{ color: '#f85606', fontWeight: 'bold' }}>৳{item.price}</span></div>))}
        <h3 style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}><span>Total:</span> <span>৳ {cartTotal.toLocaleString()}</span></h3>
      </div>
    </div>
  );
};

const OrderSuccess = () => (
  <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
    <h1 style={{ color: '#4CAF50', fontSize: '48px', margin: '0 0 20px 0' }}>🎉 Order Confirmed!</h1>
    <p style={{ fontSize: '18px', color: '#666' }}>Thank you for shopping with Online SuperShop.</p>
    <Link to="/" style={{ display: 'inline-block', marginTop: '30px', padding: '12px 25px', backgroundColor: '#f85606', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Continue Shopping</Link>
  </div>
);

// ==========================================
// 4. UPGRADED VENDOR DASHBOARD (WITH IMAGES)
// ==========================================
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [myProducts, setMyProducts] = useState([]);
  
  // NEW: State to hold the uploaded image file
  const [imageFile, setImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'Electronics', stock_quantity: '' });
  
  useEffect(() => { fetchMyProducts(); }, []);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/seller-products', { headers: { Authorization: `Bearer ${token}` } });
      setMyProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // NEW: Create FormData so we can send the image file to the backend
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('category', newProduct.category);
      formData.append('stock_quantity', newProduct.stock_quantity);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.post('http://localhost:5000/products', formData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Tell axios to send files
        } 
      });

      alert("Product Added Successfully!");
      setNewProduct({ name: '', description: '', price: '', category: 'Electronics', stock_quantity: '' });
      setImageFile(null); // Clear the file picker
      fetchMyProducts(); 
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '70vh' }}>
      <h2 style={{ color: '#333', fontSize: '28px' }}>Vendor Control Panel</h2>
      
      <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #ddd', marginBottom: '20px', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('products')} style={activeTab === 'products' ? activeTabStyle : inactiveTabStyle}>Manage Products</button>
        <button onClick={() => setActiveTab('messages')} style={activeTab === 'messages' ? activeTabStyle : inactiveTabStyle}>Customer Messages 💬</button>
      </div>

      {activeTab === 'products' && (
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>Post a New Product</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={inputStyle} />
              <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required style={{...inputStyle, height: '80px'}} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="number" placeholder="Price (৳)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required style={inputStyle} />
                <input type="number" placeholder="Stock Qty" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required style={inputStyle} />
              </div>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={inputStyle}>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Lifestyle">Home & Lifestyle</option>
                <option value="Groceries">Groceries</option>
              </select>

              {/* NEW IMAGE UPLOAD FIELD */}
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files[0])} 
                style={{...inputStyle, padding: '9px'}} 
                required 
              />

              <button type="submit" style={primaryButton}>Publish to Store</button>
            </form>
          </div>
          
          <div style={{ flex: 1.5, backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>View Own Products ({myProducts.length})</h3>
            {myProducts.length === 0 ? <p style={{ color: '#888' }}>You haven't listed any products yet.</p> : 
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myProducts.map(product => (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {product.image && <img src={`http://localhost:5000${product.image}`} alt="thumb" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                      <div><h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4><span style={{ fontSize: '12px', color: '#666', backgroundColor: '#eee', padding: '4px 8px', borderRadius: '10px' }}>{product.category}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}><p style={{ margin: '0 0 5px 0', color: '#f85606', fontWeight: 'bold' }}>৳ {product.price}</p><p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Stock: {product.stock_quantity}</p></div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Customer Inquiries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '15px', borderLeft: '4px solid #f85606', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>Buyer: Hasan Ali <span style={{ color: '#888', fontWeight: 'normal', fontSize: '12px' }}>- 10 mins ago</span></p>
              <p style={{ margin: 0 }}>"Hi! Is the Samsung Galaxy S24 still available in black?"</p>
              <button style={{ marginTop: '10px', padding: '5px 15px', border: '1px solid #f85606', color: '#f85606', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Reply</button>
            </div>
            <div style={{ padding: '15px', borderLeft: '4px solid #aaa', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>Buyer: Nusrat Jahan <span style={{ color: '#888', fontWeight: 'normal', fontSize: '12px' }}>- 2 hours ago</span></p>
              <p style={{ margin: 0 }}>"Can I get a discount if I buy 2 Air Fryers?"</p>
              <button style={{ marginTop: '10px', padding: '5px 15px', border: '1px solid #f85606', color: '#f85606', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. FOOTER COMPONENT
// ==========================================
const Footer = () => (
  <footer style={{ backgroundColor: '#2e2e54', color: '#fff', padding: '40px 20px', marginTop: 'auto' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
      <div style={{ flex: 1, minWidth: '200px' }}><h3 style={{ color: '#f85606', marginBottom: '15px' }}>Customer Care</h3><p style={footerLink}>Help Center</p><p style={footerLink}>How to Buy</p><p style={footerLink}>Returns & Refunds</p><p style={footerLink}>Contact Us</p></div>
      <div style={{ flex: 1, minWidth: '200px' }}><h3 style={{ color: '#f85606', marginBottom: '15px' }}>Earn With SuperShop</h3><p style={footerLink}>Sell on SuperShop</p><p style={footerLink}>Code of Conduct</p><p style={footerLink}>Join the Affiliate Program</p></div>
      <div style={{ flex: 1, minWidth: '200px' }}><h3 style={{ color: '#f85606', marginBottom: '15px' }}>Online SuperShop</h3><p style={footerLink}>About Us</p><p style={footerLink}>Digital Payments</p><p style={footerLink}>Privacy Policy</p></div>
      <div style={{ flex: 1, minWidth: '200px' }}><h3 style={{ color: '#f85606', marginBottom: '15px' }}>Payment Methods</h3><div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}><span style={paymentBadge}>Bkash</span><span style={paymentBadge}>Nagad</span><span style={paymentBadge}>Visa</span><span style={paymentBadge}>MasterCard</span></div></div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #444', fontSize: '14px', color: '#aaa' }}>© 2026 Online SuperShop. All Rights Reserved. Practicum Project.</div>
  </footer>
);

// ==========================================
// MAIN APP CONTENT
// ==========================================
function AppContent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('userRole') || null); 
  const navigate = useNavigate();

  const backupProducts = [
    { id: 101, name: 'Samsung Galaxy S24 Ultra', price: 145000, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80' },
    { id: 102, name: 'Sony WH-1000XM5 Headphones', price: 35000, category: 'Electronics', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' },
    { id: 103, name: 'MacBook Air M3', price: 135000, category: 'Computers', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 104, name: 'Nike Air Force 1', price: 8500, category: 'Fashion', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80' },
    { id: 105, name: 'Philips Air Fryer XL', price: 12500, category: 'Home Appliances', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
    { id: 106, name: 'Apple Watch Series 9', price: 45000, category: 'Wearables', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80' },
    { id: 107, name: 'Vintage Denim Jacket', price: 3200, category: 'Fashion', image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0eb?w=500&q=80' },
    { id: 108, name: 'Casio G-Shock Watch', price: 6500, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80' }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        if (response.data && response.data.length > 0) {
          setProducts([...response.data, ...backupProducts]);
        } else {
          setProducts(backupProducts);
        }
      })
      .catch(() => setProducts(backupProducts));
  }, []);

  const addToCart = (product) => { setCart([...cart, product]); setIsCartOpen(true); };
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((total, item) => total + (item.price || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setRole(null);
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#f85606', color: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>ONLINE SUPERSHOP</h1></Link>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="text" placeholder="Search in SuperShop..." style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', width: '300px' }} />
          
          {!role ? (
            <>
              <Link to="/login" style={navButton}>Login</Link>
              <Link to="/register" style={{ ...navButton, backgroundColor: '#333' }}>Register</Link>
            </>
          ) : (
            <>
              {(role === 'seller' || role === 'admin') && ( <Link to="/dashboard" style={navButton}>Vendor Dashboard</Link> )}
              <button onClick={handleLogout} style={{ ...navButton, backgroundColor: '#dc3545', color: 'white' }}>Logout</button>
            </>
          )}

          <button onClick={() => setIsCartOpen(true)} style={{...navButton, backgroundColor: '#0f136d', color: 'white'}}>🛒 Cart ({cart.length})</button>
        </div>
      </nav>

      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh', backgroundColor: 'white', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Your Cart</h2><button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Your cart is empty.</p> : 
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                  <div><h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.name}</h4><p style={{ margin: 0, color: '#f85606', fontWeight: 'bold' }}>৳ {item.price}</p></div>
                  <button onClick={() => removeFromCart(index)} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))
            }
          </div>
          <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: 'auto' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 15px 0' }}><span>Total:</span> <span>৳ {cartTotal.toLocaleString()}</span></h3>
            <button onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} style={primaryButton}>Proceed to Checkout</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

      <Footer />

    </div>
  );
}

export default function App() { return <Router><AppContent /></Router>; }

// ==========================================
// CSS STYLES
// ==========================================
const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const primaryButton = { width: '100%', padding: '15px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };
const navButton = { padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#f85606', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' };
const activeTabStyle = { padding: '10px 20px', border: 'none', backgroundColor: '#f85606', color: 'white', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' };
const inactiveTabStyle = { padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#f4f4f4', color: '#333', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' };
const footerLink = { fontSize: '14px', margin: '0 0 8px 0', cursor: 'pointer', color: '#ccc' };
const paymentBadge = { backgroundColor: 'white', color: '#2e2e54', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };