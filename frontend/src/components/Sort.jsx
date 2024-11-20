import React from 'react';
import './Sort.css';

const Sort = ({ onSort }) => {
  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <div className="sort-container">
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" onChange={handleSortChange} aria-label="Sort Options">
        <option value="priceAsc">Price (Low to High)</option>
        <option value="priceDesc">Price (High to Low)</option>
      </select>
    </div>
  );
};

export default Sort;
