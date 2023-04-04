import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('mount and unmount without crashing', async () => {
  const div = document.createElement('div');
  const root = ReactDOM.createRoot(div);

  await waitFor(() => {
    root.render(<Router><App /></Router>);
    root.unmount();
  });
});

test('render any element', () => {
  render(<Router><App /></Router>);
  const anyElement = screen.getAllByText(/Character Name/i);
  expect(anyElement[0]).toBeInTheDocument();
});
