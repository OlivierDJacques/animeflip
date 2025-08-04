jest.mock('../../api/cache.js');
jest.mock('../../api/handleCORS.js');
jest.mock('../../api/generateTop500Anime.js');

const { readCache, CACHE_TIME } = require('../../api/cache.js');
const { handleCORS } = require('../../api/handleCORS.js');
const { generateTop500Anime } = require('../../api/generateTop500Anime.js');
const handler = require('../../api/top500.js');

describe('../../api/top500 handler', () => {
  let req, res;

  beforeEach(() => {
    req = { method: 'GET', headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('should handle CORS', async () => {
    await handler(req, res);
    
    expect(handleCORS).toHaveBeenCalledWith(req, res);
  });

  test('should handle OPTIONS preflight request', async () => {
    req.method = 'OPTIONS';

    await handler(req, res);

    expect(handleCORS).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test('should return cached data if cache is valid', async () => {
    const now = Math.floor(Date.now() / 1000);
    const mockCache = {
      timestamp: now - (CACHE_TIME - 10),
      topAnimeList: [{ id: 1, title: 'Cached Anime' }],
    };

    readCache.mockResolvedValue(mockCache);

    await handler(req, res);

    expect(handleCORS).toHaveBeenCalledWith(req, res);
    expect(readCache).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCache.topAnimeList);
  });

  test('should generate data if cache is expired or missing', async () => {
    const now = Math.floor(Date.now() / 1000);
    const expiredCache = {
      timestamp: now - (CACHE_TIME + 100),
      topAnimeList: [{ id: 1, title: 'Old Anime' }],
    };

    const newTopAnime = [{ id: 2, title: 'Fresh Anime' }];
    readCache.mockResolvedValue(expiredCache);
    generateTop500Anime.mockResolvedValue(newTopAnime);

    await handler(req, res);

    expect(readCache).toHaveBeenCalled();
    expect(generateTop500Anime).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(newTopAnime);
  });

  test('should handle missing cache gracefully', async () => {
    readCache.mockResolvedValue(null); 
    const newTopAnime = [{ id: 3, title: 'Generated Anime' }];
    generateTop500Anime.mockResolvedValue(newTopAnime);

    await handler(req, res);

    expect(generateTop500Anime).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(newTopAnime);
  });

  test('should respond with 500 on internal error', async () => {
    const error = new Error('Something went wrong');
    readCache.mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await handler(req, res);

    expect(handleCORS).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });

    consoleErrorSpy.mockRestore();
  });
});