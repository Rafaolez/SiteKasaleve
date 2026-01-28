import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

<script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.41/build/spline-viewer.js"></script>
