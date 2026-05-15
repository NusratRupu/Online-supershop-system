import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  // Fetch products from your backend when the page loads
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  return (
    <div className="App">
      {/* DARAZ STYLE NAVIGATION BAR */}
      <nav style={styles.navbar}>
        <h1 style={{ margin: 0 }}>My SuperShop</h1>
        <div>
          <button style={styles.navButton}>Login</button>
          <button style={styles.navButton}>Cart</button>
        </div>
      </nav>

      {/* MAIN PRODUCT GRID */}
      <div style={styles.container}>
        <h2>Just For You</h2>
        <div style={styles.grid}>
          {products.length === 0 ? (
            <p>No products found. Add some from Thunder Client!</p>
          ) : (
            products.map(product => (
              <div key={product.id} style={styles.card}>
                <div style={styles.imagePlaceholder}>Image</div>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.price}>৳ {product.price}</p>
                <button style={styles.buyButton}>Add to Cart</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Inline CSS
const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#f85606', color: 'white' },
  navButton: { marginLeft: '10px', padding: '8px 15px', border: 'none', backgroundColor: 'white', color: '#f85606', cursor: 'pointer', fontWeight: 'bold' },
  container: { padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' },
  card: { border: '1px solid #ddd', padding: '15px', borderRadius: '5px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  imagePlaceholder: { width: '100%', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', marginBottom: '10px' },
  productName: { fontSize: '16px', margin: '10px 0' },
  price: { color: '#f85606', fontSize: '18px', fontWeight: 'bold' },
  buyButton: { width: '100%', padding: '10px', backgroundColor: '#f85606', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }
};

export default App;