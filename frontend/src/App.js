import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // THE SAFETY NET: If your database fails, this data loads automatically so your site never looks blank!
  const backupProducts = [
    { id: 101, name: 'Samsung Galaxy S24 Ultra', description: 'Titanium frame, AI features.', price: 145000, category: 'Mobiles' },
    { id: 102, name: 'Sony WH-1000XM5 Headphones', description: 'Noise cancellation.', price: 35000, category: 'Electronics' },
    { id: 103, name: 'Nike Air Force 1', description: 'Classic white sneakers.', price: 8500, category: 'Fashion' },
    { id: 104, name: 'MacBook Air M3', description: 'Apple M3 chip, 8GB RAM.', price: 135000, category: 'Computers' },
    { id: 105, name: 'Philips Air Fryer XL', description: 'Fry with 90% less fat.', price: 12500, category: 'Home Appliances' },
    { id: 106, name: 'Men’s Denim Jacket', description: 'Classic blue vintage wash.', price: 2200, category: 'Fashion' }
  ];

  useEffect(() => {
    // Try to get real data from your backend
    axios.get('http://localhost:5000/products')
      .then(response => {
        if (response.data && response.data.length > 0) {
          setProducts(response.data); // Use real database products
        } else {
          setProducts(backupProducts); // DB is empty? Use the safety net!
        }
      })
      .catch(error => {
        console.error("Backend offline, loading safety net data...");
        setProducts(backupProducts); // Backend crashed? Use the safety net!
      });
  }, []);

  // --- CART ACTIONS ---
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      
      {/* 1. NAVBAR (Daraz Style) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#f85606', color: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>ONLINE SUPERSHOP</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input type="text" placeholder="Search in SuperShop..." style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', width: '300px' }} />
          <button style={{ padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#f85606', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
          <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ padding: '8px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#0f136d', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            🛒 Cart ({cart.length})
          </button>
        </div>
      </nav>

      {/* 2. HERO BANNER */}
      <div style={{ backgroundColor: '#ffddc2', padding: '40px', textAlign: 'center', margin: '20px', borderRadius: '8px', border: '1px solid #f85606' }}>
        <h2 style={{ color: '#f85606', fontSize: '32px', margin: '0 0 10px 0' }}>Mega Winter Sale Is Live!</h2>
        <p style={{ fontSize: '18px', color: '#333' }}>Up to 60% off on Electronics, Fashion, and Home Appliances.</p>
      </div>

      {/* 3. PRODUCT GRID */}
      <div style={{ padding: '0 40px 40px 40px' }}>
        <h2 style={{ color: '#333', borderBottom: '2px solid #f85606', display: 'inline-block', paddingBottom: '5px' }}>Just For You</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {products.map((product, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '15px', color: '#999' }}>
                [Product Image]
              </div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#888' }}>{product.category}</p>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#f85606', fontWeight: 'bold' }}>৳ {product.price.toLocaleString()}</p>
              <button onClick={() => addToCart(product)} style={{ width: '100%', padding: '10px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SHOPPING CART SIDEBAR */}
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
            <button style={{ width: '100%', padding: '15px', backgroundColor: '#f85606', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;