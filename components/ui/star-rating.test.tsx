import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating, StarRatingDisplay } from './star-rating';

describe('StarRating Component', () => {
  test('renders 5 stars', () => {
    render(<StarRating rating={0} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  test('shows correct rating', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByRole('button');
    // First 3 stars should be filled, last 2 should be empty
    expect(stars[0]).toHaveClass('fill-yellow-400');
    expect(stars[1]).toHaveClass('fill-yellow-400');
    expect(stars[2]).toHaveClass('fill-yellow-400');
    expect(stars[3]).toHaveClass('fill-transparent');
    expect(stars[4]).toHaveClass('fill-transparent');
  });

  test('calls onRatingChange when star is clicked', () => {
    const mockOnChange = jest.fn();
    render(<StarRating rating={0} onRatingChange={mockOnChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]); // Click 3rd star
    
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  test('removes rating when same star is clicked again', () => {
    const mockOnChange = jest.fn();
    render(<StarRating rating={3} onRatingChange={mockOnChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[2]); // Click 3rd star again
    
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  test('shows score when showScore is true', () => {
    render(<StarRating rating={4} showScore={true} />);
    expect(screen.getByText('(4.0)')).toBeInTheDocument();
  });

  test('does not show score when showScore is false', () => {
    render(<StarRating rating={4} showScore={false} />);
    expect(screen.queryByText('(4.0)')).not.toBeInTheDocument();
  });

  test('is readonly when readonly prop is true', () => {
    const mockOnChange = jest.fn();
    render(<StarRating rating={3} readonly={true} onRatingChange={mockOnChange} />);
    
    const stars = screen.getAllByRole('button');
    fireEvent.click(stars[0]);
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});

describe('StarRatingDisplay Component', () => {
  test('renders 5 stars', () => {
    render(<StarRatingDisplay rating={0} />);
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
  });

  test('shows correct rating', () => {
    render(<StarRatingDisplay rating={2.5} />);
    const stars = screen.getAllByTestId('star');
    // First 2 stars should be filled, last 3 should be empty
    expect(stars[0]).toHaveClass('fill-yellow-400');
    expect(stars[1]).toHaveClass('fill-yellow-400');
    expect(stars[2]).toHaveClass('fill-transparent');
    expect(stars[3]).toHaveClass('fill-transparent');
    expect(stars[4]).toHaveClass('fill-transparent');
  });

  test('shows score when showScore is true', () => {
    render(<StarRatingDisplay rating={3.5} showScore={true} />);
    expect(screen.getByText('(3.5)')).toBeInTheDocument();
  });
});

