import React from 'react';
import './ProductList.css';

const ProductList = ({ products }) => {
  return (
    <div className="product-list" role="list">
      {products.map((product) => (
        <div key={product.id} className="product-card" role="listitem">
          <h2>{product.name}</h2>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Rating: {product.rating ? product.rating : 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
