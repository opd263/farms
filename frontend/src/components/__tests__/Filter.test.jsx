import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter from '../Filter';

test('calls onFilter with correct values', () => {
  const mockOnFilter = jest.fn();

  render(<Filter onFilter={mockOnFilter} />);

  const minPriceInput = screen.getByLabelText('Minimum Price');
  const maxPriceInput = screen.getByLabelText('Maximum Price');
  const minRatingInput = screen.getByLabelText('Minimum Rating');
  const filterButton = screen.getByRole('button', { name: /apply filter/i });

  // Simulate user input
  fireEvent.change(minPriceInput, { target: { value: '10' } });
  fireEvent.change(maxPriceInput, { target: { value: '100' } });
  fireEvent.change(minRatingInput, { target: { value: '4' } });

  // Simulate form submission
  fireEvent.click(filterButton);

  // Assert that onFilter was called with the right arguments
  expect(mockOnFilter).toHaveBeenCalledWith(10, 100, 4);
});
