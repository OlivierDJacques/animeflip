const { readCache, CACHE_TIME } = require('../../api/cache.js');
const { handleCORS } = require('../../api/handleCORS.js');
const { generateTop500Anime } = require('../../api/generateTop500Anime.js');
const { getRandomAnime } = require('../../api/randomAnime.js');
const handler = require('../../api/daily.js');

jest.mock('../../api/cache.js', () => ({
  readCache: jest.fn(),
  CACHE_TIME: 86400, 
}));

jest.mock('../../api/handleCORS', () => ({
  handleCORS: jest.fn(),
}));

jest.mock('../../api/generateTop500Anime', () => ({
  generateTop500Anime: jest.fn(),
}));

jest.mock('../../api/randomAnime', () => ({
  getRandomAnime: jest.fn(),
}));

describe('/api/daily handler', () => {
  let req, res;

  beforeEach(() => {
    req = { method: 'GET' };
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

  test('If HTTP Request is OPTIONS, should respond with 200 and end connection', async () => {
    req.method = 'OPTIONS';
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test('If cache has data and is fresh, should return random anime for the current date', async () => {
    const now = Math.floor(Date.now() / 1000);
    const mockCache = {
      topAnimeList: [{ id: 1, name: 'item1' }],
      timestamp: now - CACHE_TIME / 2,
    };
    readCache.mockResolvedValue(mockCache);

    getRandomAnime.mockReturnValue([{ id: 1, name: 'item1' }]);
    await handler(req, res);

    expect(readCache).toHaveBeenCalled();
    expect(generateTop500Anime).not.toHaveBeenCalled();
  });

  test('If cache has data but is not fresh, should update list and run generateTop500Anime', async () => {
    const mockNow = Math.floor(Date.now() / 10000);
    const mockCache = {
      topAnimeList: [{ id: 1, name: 'item1' }],
      timestamp: mockNow - CACHE_TIME / 2,
    };
    readCache.mockResolvedValue(mockCache);

    getRandomAnime.mockReturnValue([{ id: 1, name: 'item1' }]);
    await handler(req, res);

    expect(readCache).toHaveBeenCalled();
    expect(generateTop500Anime).toHaveBeenCalled();
  });

  test('If cache has no data but is fresh, should update list and run generateTop500Anime', async () => {
    const mockNow = Math.floor(Date.now() / 1000);
    const mockCache = {};
    readCache.mockResolvedValue(mockCache);

    getRandomAnime.mockReturnValue([{ id: 1, name: 'item1' }]);
    await handler(req, res);

    expect(readCache).toHaveBeenCalled();
    expect(generateTop500Anime).toHaveBeenCalled();
  });

  test('If cache has no data and is not fresh, should update list and run generateTop500Anime', async () => {
    const mockNow = Math.floor(Date.now() / 10000);
    const mockCache = {};
    readCache.mockResolvedValue(mockCache);

    getRandomAnime.mockReturnValue([{ id: 1, name: 'item1' }]);
    await handler(req, res);

    expect(readCache).toHaveBeenCalled();
    expect(generateTop500Anime).toHaveBeenCalled();
  });

  test('should respond with 500 if an error occurs', async () => {
    const errorMessage = 'Internal Server Error';
    readCache.mockRejectedValue(new Error(errorMessage));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });

    consoleErrorSpy.mockRestore();
  });
});