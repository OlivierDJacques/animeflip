const { handleCORS } = require('../../api/handleCORS');

describe('handleCORS', () => {
  let req, res;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      setHeader: jest.fn(),
    };
  });

  test('should set CORS headers for allowed origins', () => {
    req.headers.origin = 'http://127.0.0.1:5500';

    handleCORS(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET,OPTIONS');
    expect(res.setHeader).toHaveBeenCalledWith('Vary', 'Origin');
  });

  test('should not set CORS headers for disallowed origins', () => {
    req.headers.origin = 'http://unauthorized-origin.com';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    handleCORS(req, res);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('CORS request from disallowed origin: http://unauthorized-origin.com');
    consoleWarnSpy.mockRestore();
  });

  test('should not set CORS headers if origin is undefined', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    handleCORS(req, res);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('CORS request from disallowed origin: undefined');
    consoleWarnSpy.mockRestore();
  });
});