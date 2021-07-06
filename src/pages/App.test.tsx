import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './routes';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/hello/i);
  expect(linkElement).toBeInTheDocument();
});
