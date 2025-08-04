const { lcg, getRandomAnime } = require('../../api/randomAnime');

describe('lcg', () => {

  test('should generate deterministic pseudo-random numbers for a given seed', () => {
    const seed = 12345;
    const rand = lcg(seed);

    const mockA = rand();
    const mockB = rand();
    const mockC = rand();

    const rand2 = lcg(seed);

    expect(rand2()).toBe(mockA);
    expect(rand2()).toBe(mockB);
    expect(rand2()).toBe(mockC);
  });

  test('should generate numbers between 0 and 1', () => {
    const seed = 67890;
    const rand = lcg(seed);

    for (let i = 0; i < 100; i++) {
      const num = rand();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    }
  });
});

describe('getRandomAnime', () => {
  test('should return 9 random anime from the list', () => {
    const topAnimeList = [
      { id: 1, name: 'Anime 1' },
      { id: 2, name: 'Anime 2' },
      { id: 3, name: 'Anime 3' },
      { id: 4, name: 'Anime 4' },
      { id: 5, name: 'Anime 5' },
      { id: 6, name: 'Anime 6' },
      { id: 7, name: 'Anime 7' },
      { id: 8, name: 'Anime 8' },
      { id: 9, name: 'Anime 9' },
      { id: 10, name: 'Anime 10' },
    ];

    const seed = 20250802;
    const result = getRandomAnime([...topAnimeList], seed);

    expect(result).toHaveLength(9);

    const uniqueIds = new Set(result.map(anime => anime.id));
    expect(uniqueIds.size).toBe(9);

    result.forEach(anime => {
      expect(topAnimeList).toContainEqual(anime);
    });
  });

  test('should return the same selection for the same seed', () => {
    const topAnimeList = [
      { id: 1, name: 'Anime 1' },
      { id: 2, name: 'Anime 2' },
      { id: 3, name: 'Anime 3' },
      { id: 4, name: 'Anime 4' },
      { id: 5, name: 'Anime 5' },
      { id: 6, name: 'Anime 6' },
      { id: 7, name: 'Anime 7' },
      { id: 8, name: 'Anime 8' },
      { id: 9, name: 'Anime 9' },
      { id: 10, name: 'Anime 10' },
    ];

    const seed = 20250802;

    const result1 = getRandomAnime([...topAnimeList], seed);
    const result2 = getRandomAnime([...topAnimeList], seed);

    expect(result1).toEqual(result2);
  });

  test('should not modify the original list', () => {
    const topAnimeList = [
      { id: 1, name: 'Anime 1' },
      { id: 2, name: 'Anime 2' },
      { id: 3, name: 'Anime 3' },
      { id: 4, name: 'Anime 4' },
      { id: 5, name: 'Anime 5' },
      { id: 6, name: 'Anime 6' },
      { id: 7, name: 'Anime 7' },
      { id: 8, name: 'Anime 8' },
      { id: 9, name: 'Anime 9' },
      { id: 10, name: 'Anime 10' }
    ];
  
    const seed = 20250802;
  
    const originalList = JSON.parse(JSON.stringify(topAnimeList));
  
    getRandomAnime(topAnimeList, seed);
    getRandomAnime(originalList, seed);
  
    expect(topAnimeList).toEqual(originalList);
  });
});