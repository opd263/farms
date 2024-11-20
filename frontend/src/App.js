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

  // POST: Add a new product
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, data.product]);
      setFilteredProducts((prevProducts) => [...prevProducts, data.product]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // PATCH: Update an existing product
  const updateProduct = async (id, updatedFields) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, ...data.product } : product
        )
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, ...data.product } : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // DELETE: Remove a product
  const deleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>E-Commerce Store</h1>
      </header>
      <div className="controls">
        <Filter onFilter={handleFilter} />
        <Sort onSort={handleSort} />
        {/* Example buttons to test the CRUD operations */}
        <button
          onClick={() =>
            addProduct({
              name: 'New Product',
              price: 100,
              rating: 4.5,
              description: 'A brand new product',
            })
          }
        >
          Add Product
        </button>
        <button
          onClick={() =>
            updateProduct(1, { price: 120, rating: 5 })
          }
        >
          Update Product
        </button>
        <button
          onClick={() => deleteProduct(1)}
        >
          Delete Product
        </button>
      </div>
      {loading ? <p>Loading...</p> : <ProductList products={filteredProducts} />}
    </div>
  );
};

export default App;
