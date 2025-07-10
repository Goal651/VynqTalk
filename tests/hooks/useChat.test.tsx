import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useChat } from '../../src/hooks/useChat';

describe('useChat', () => {
  it('should initialize without crashing', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current).toBeDefined();
  });
}); 