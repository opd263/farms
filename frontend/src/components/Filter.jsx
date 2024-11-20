import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onFilter }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(Number(minPrice), Number(maxPrice), Number(minRating));
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <label>
        Min Price:
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          aria-label="Minimum Price"
        />
      </label>
      <label>
        Max Price:
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maximum Price"
        />
      </label>
      <label>
        Min Rating:
        <input
          type="number"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          aria-label="Minimum Rating"
        />
      </label>
      <button type="submit">Apply Filter</button>
    </form>
  );
};

export default Filter;
