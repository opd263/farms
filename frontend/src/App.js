import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Filter from './components/Filter';
import Sort from './components/Sort';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = (minPrice, maxPrice, minRating) => {
    const filtered = products.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.rating >= minRating
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (sortBy) => {
    const sorted = [...filteredProducts].sort((a, b) =>
      sortBy === 'priceAsc'
        ? a.price - b.price
        : sortBy === 'priceDesc'
        ? b.price - a.price
        : 0
    );
    setFilteredProducts(sorted);
  };

  return (
    <div className="app">
      <header>
        <h1>E-Commerce Store</h1>
      </header>
      <div className="controls">
        <Filter onFilter={handleFilter} />
        <Sort onSort={handleSort} />
      </div>
      {loading ? <p>Loading...</p> : <ProductList products={filteredProducts} />}
    </div>
  );
};

export default App;


