import { checkNgrokInstalled, detectSystemConfig } from '../../src/utils/systemDetector';

// Mock child_process
const mockExecSync = jest.fn();
jest.mock('child_process', () => ({
  execSync: mockExecSync
}));

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('systemDetector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkNgrokInstalled', () => {
    it('should detect ngrok on Windows', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32' });
      
      // Mock successful ngrok detection
      mockExecSync
        .mockReturnValueOnce('') // where ngrok succeeds
        .mockReturnValueOnce('Valid configuration'); // config check succeeds
      
      const result = await checkNgrokInstalled();
      
      expect(result).toEqual({ installed: true, hasToken: true });
      expect(mockExecSync).toHaveBeenCalledWith('where ngrok', { stdio: 'ignore' });
      
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect ngrok on macOS/Linux', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      
      mockExecSync
        .mockReturnValueOnce('') // which ngrok succeeds
        .mockReturnValueOnce('Valid configuration'); // config check succeeds
      
      const result = await checkNgrokInstalled();
      
      expect(result).toEqual({ installed: true, hasToken: true });
      expect(mockExecSync).toHaveBeenCalledWith('which ngrok', { stdio: 'ignore' });
      
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect when ngrok is not installed', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Command not found');
      });
      
      const result = await checkNgrokInstalled();
      
      expect(result).toEqual({ installed: false, hasToken: false });
    });

    it('should detect when ngrok is installed but no token', async () => {
      mockExecSync
        .mockReturnValueOnce('') // ngrok exists
        .mockImplementation(() => {
          throw new Error('No token found');
        }); // config check fails
      
      const result = await checkNgrokInstalled();
      
      expect(result).toEqual({ installed: true, hasToken: false });
    });
  });

  describe('detectSystemConfig', () => {
    it('should detect macOS with ngrok and token', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      
      mockExecSync
        .mockReturnValueOnce('') // ngrok exists
        .mockReturnValueOnce('Valid configuration'); // has token
      
      const result = await detectSystemConfig();
      
      expect(result.platform).toBe('darwin');
      expect(result.ngrokInstalled).toBe(true);
      expect(result.ngrokHasToken).toBe(true);
      expect(result.canAutoSetup).toBe(true);
      
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect Windows without ngrok', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'win32' });
      
      mockExecSync.mockImplementation(() => {
        throw new Error('Command not found');
      });
      
      const result = await detectSystemConfig();
      
      expect(result.platform).toBe('win32');
      expect(result.ngrokInstalled).toBe(false);
      expect(result.ngrokHasToken).toBe(false);
      expect(result.canAutoSetup).toBe(false);
      
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('should detect Linux with ngrok but no token', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'linux' });
      
      mockExecSync
        .mockReturnValueOnce('') // ngrok exists
        .mockImplementation(() => {
          throw new Error('No token');
        }); // no token
      
      const result = await detectSystemConfig();
      
      expect(result.platform).toBe('linux');
      expect(result.ngrokInstalled).toBe(true);
      expect(result.ngrokHasToken).toBe(false);
      expect(result.canAutoSetup).toBe(false);
      
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });
  });
});
