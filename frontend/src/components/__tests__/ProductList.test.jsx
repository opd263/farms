import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from '../ProductList';

test('renders product list with product details', () => {
  const products = [
    { id: 1, name: 'Product A', price: 10.99, rating: 4.5 },
    { id: 2, name: 'Product B', price: 20.5, rating: 3.8 },
  ];

  render(<ProductList products={products} />);

  // Check that product cards are rendered
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();

  // Check product details
  expect(screen.getByText('Price: $10.99')).toBeInTheDocument();
  expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
});
