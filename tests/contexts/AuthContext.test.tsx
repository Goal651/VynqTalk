import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../../src/contexts/AuthContext';

describe('AuthContext', () => {
  it('renders children', () => {
    render(
      <AuthProvider>
        <div>Auth Child</div>
      </AuthProvider>
    );
    expect(screen.getByText('Auth Child')).toBeInTheDocument();
  });
}); 