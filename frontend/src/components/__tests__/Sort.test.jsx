import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sort from '../Sort';

test('calls onSort with selected sort option', () => {
  const mockOnSort = jest.fn();

  render(<Sort onSort={mockOnSort} />);

  const sortSelect = screen.getByLabelText(/sort by/i);

  // Simulate selecting a sort option
  fireEvent.change(sortSelect, { target: { value: 'priceAsc' } });

  // Assert that onSort was called with the correct value
  expect(mockOnSort).toHaveBeenCalledWith('priceAsc');

  fireEvent.change(sortSelect, { target: { value: 'priceDesc' } });
  expect(mockOnSort).toHaveBeenCalledWith('priceDesc');
});
