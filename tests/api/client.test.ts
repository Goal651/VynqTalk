import { apiClient } from './../../src/api/client';
import '@testing-library/jest-dom';


describe('API Client', () => {
    it('should export get, post, put, and del functions', () => {
        expect(typeof apiClient.get).toBe('function');
        expect(typeof apiClient.post).toBe('function');
        expect(typeof apiClient.put).toBe('function');
        expect(typeof apiClient.delete).toBe('function');
    });
}); 