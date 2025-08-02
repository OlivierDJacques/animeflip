const axios = require('axios');
const { writeCache } = require('../../api/cache');
const { generateTop500Anime } = require('../../api/generateTop500Anime');

jest.mock('axios'); 
jest.mock('../../api/cache', () => ({
  writeCache: jest.fn()
}));

describe('generateTop500Anime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch top 500 anime and write to cache', async () => {
    const mockApiResponse = {
      data: {
        data: [
          { node: { id: 1, title: 'Anime 1', popularity: 1 } },
          { node: { id: 2, title: 'Anime 2', popularity: 2 } },
        ],
      },
    };
    axios.get.mockResolvedValue(mockApiResponse);

    const result = await generateTop500Anime();

    expect(axios.get).toHaveBeenCalledWith('https://api.myanimelist.net/v2/anime/ranking', {
      headers: { Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}` },
      params: {
        ranking_type: 'bypopularity',
        limit: 500,
        fields: 'id,title,alternative_titles,main_picture,popularity',
      },
    });

    expect(writeCache).toHaveBeenCalledWith([
      { id: 1, title: 'Anime 1', popularity: 1 },
      { id: 2, title: 'Anime 2', popularity: 2 },
    ]);

    expect(result).toEqual([
      { id: 1, title: 'Anime 1', popularity: 1 },
      { id: 2, title: 'Anime 2', popularity: 2 },
    ]);
  });

  test('should throw an error if the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    await expect(generateTop500Anime()).rejects.toThrow('API Error');

    expect(writeCache).not.toHaveBeenCalled();
  });
});