import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Business Card Generator/i);
  expect(titleElement).toBeInTheDocument();
});
