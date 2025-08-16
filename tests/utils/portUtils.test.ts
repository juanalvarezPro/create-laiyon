import { getFreePort } from '../../src/utils/portUtils';

// Mock simple del módulo net
jest.mock('net', () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn((port, callback) => callback()),
    close: jest.fn((callback) => callback()),
    on: jest.fn(),
    address: jest.fn(() => ({ port: 3001 })) // Simula que devuelve 3001
  }))
}));

describe('portUtils', () => {
  it('should return a port number', async () => {
    const port = await getFreePort(3000);
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
  });
});