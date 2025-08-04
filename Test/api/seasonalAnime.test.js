const axios = require('axios');
const { handleCORS } = require('../../api/handleCORS');
const { seasonalAnime, handler } = require('../../api/seasonalAnime');

jest.mock('axios');

jest.mock('../../api/handleCORS', () => ({
  handleCORS: jest.fn(),
}));

describe('seasonalAnime.js module', () => {
  let req, res;
  let seasonalAnimeSpy;

  beforeEach(() => {
    axios.get.mockReset();
    handleCORS.mockReset();

    req = { method: 'GET', headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
  });

  describe('seasonalAnime function logic', () => {
    test('should fetch and return seasonal anime', async () => {
      const mockApiResponse = {
        data: {
          data: [
            { node: { id: 1, title: 'Anime 1', rank: 1 } },
            { node: { id: 2, title: 'Anime 2', rank: 2 } },
          ],
        },
      };
      axios.get.mockResolvedValue(mockApiResponse);

      const result = await seasonalAnime();

      expect(axios.get).toHaveBeenCalledWith('https://api.myanimelist.net/v2/anime/ranking', {
        headers: { Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}` },
        params: {
          ranking_type: 'airing',
          limit: 200,
          fields: 'id,title,main_picture,rank,popularity',
        },
      });
      expect(result).toEqual([
        { id: 1, title: 'Anime 1', rank: 1 },
        { id: 2, title: 'Anime 2', rank: 2 },
      ]);
    });

    test('should throw an error if the API call fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(seasonalAnime()).rejects.toThrow('API Error');

      expect(axios.get).toHaveBeenCalledTimes(1);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('handler function logic', () => {
    beforeEach(() => {
      seasonalAnimeSpy = jest.spyOn(require('../../api/seasonalAnime'), 'seasonalAnime');
    });

    afterEach(() => {
      seasonalAnimeSpy.mockRestore();
    });

    test('should handle CORS', async () => {
      seasonalAnimeSpy.mockResolvedValue([]);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await handler(req, res);
      
      expect(handleCORS).toHaveBeenCalledWith(req, res);
      consoleErrorSpy.mockRestore();
    });

    test('should handle OPTIONS request', async () => {
      req.method = 'OPTIONS';
      seasonalAnimeSpy.mockResolvedValue([]);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
      expect(seasonalAnimeSpy).not.toHaveBeenCalled();
    });

    test('should return seasonal anime for GET request', async () => {
        const mockApiResponse = {
          data: {
            data: [
              { node: { id: 1, title: 'Anime 1', main_picture: 'url1', rank: 1, popularity: 100 } },
              { node: { id: 2, title: 'Anime 2', main_picture: 'url2', rank: 2, popularity: 200 } },
            ],
          },
        };

        axios.get.mockResolvedValue(mockApiResponse);
      
        seasonalAnimeSpy.mockImplementation(async () => {
          const response = await axios.get('https://api.myanimelist.net/v2/anime/ranking', {
            headers: { Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}` },
            params: {
              ranking_type: 'airing',
              limit: 200,
              fields: 'id,title,main_picture,rank,popularity',
            },
          });
          const seasonalAnime = response.data.data.map((anime) => anime.node);
          return seasonalAnime;
        });
      
        await handler(req, res);
      
        expect(handleCORS).toHaveBeenCalledWith(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
          { id: 1, title: 'Anime 1', main_picture: 'url1', rank: 1, popularity: 100 },
          { id: 2, title: 'Anime 2', main_picture: 'url2', rank: 2, popularity: 200 },
        ]);
      });

      test('should respond with 500 if an error occurs', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValue(new Error('API Error'));
      
        // seasonalAnime implementation will now throw due to mocked axios.get
        seasonalAnimeSpy.mockImplementation(async () => {
          const response = await axios.get('https://api.myanimelist.net/v2/anime/ranking', {
            headers: { Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}` },
            params: {
              ranking_type: 'airing',
              limit: 200,
              fields: 'id,title,main_picture,rank,popularity',
            },
          });
          const seasonalAnime = response.data.data.map((anime) => anime.node);
          return seasonalAnime;
        });
      

        await handler(req, res);
      
        expect(handleCORS).toHaveBeenCalledWith(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'API Error' });
      
        consoleErrorSpy.mockRestore();
      });

  });
});