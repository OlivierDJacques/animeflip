import { CACHE_TIME, CACHE_FILE, readCache, writeCache } from '../../api/cache';

jest.mock('fs/promises', () => ({
  stat: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

const fs = require('fs/promises');

describe('readCache', () => {

  beforeEach(() => {
    fs.stat.mockReset();
    fs.readFile.mockReset();
    fs.writeFile.mockReset();
  });

  test('Should return parsed data if cache is fresh', async () => {
    const mockData = [{ id: 1, name: 'item1' }];
    const mockMtimeMs = Date.now() - (CACHE_TIME / 2) * 1000;

    fs.stat.mockResolvedValue({ mtimeMs: mockMtimeMs });
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));

    const result = await readCache();

    expect(result).toEqual(mockData);
  });

  test('should return null if cache is stale', async () => {
    const mockMtimeMs = Date.now() - (CACHE_TIME + 100) * 1000; 
    fs.stat.mockResolvedValue({ mtimeMs: mockMtimeMs });

    const result = await readCache();

    expect(fs.readFile).not.toHaveBeenCalled();

    expect(result).toBeNull();
  });


  test('should return null if cache file does not exist', async () => {
    fs.stat.mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const result = await readCache();

    expect(fs.readFile).not.toHaveBeenCalled();

    expect(result).toBeNull();
  });

  test('should return null if there is an error reading the file', async () => {
    const mockMtimeMs = Date.now() - (CACHE_TIME / 2) * 1000; 

    fs.stat.mockResolvedValue({ mtimeMs: mockMtimeMs });
    fs.readFile.mockRejectedValue(new Error('EACCES: permission denied'));

    const result = await readCache();


    expect(result).toBeNull();
  });

  test('should return null if cache file contains invalid JSON', async () => {
    const mockMtimeMs = Date.now() - (CACHE_TIME / 2) * 1000; 

    fs.stat.mockResolvedValue({ mtimeMs: mockMtimeMs });

    fs.readFile.mockResolvedValue('this is not valid json');

    const result = await readCache();


    expect(result).toBeNull();
  });

  test ('Should write a file if it exists and is not stale', async () => {
    const mockData = [{ id: 1, name: 'item1' }];
    const mockResult = {
      topAnimeList: [{ id: 1, name: 'item1' }], 
      timestamp: Math.floor(Date.now() / 1000)};

    await writeCache(mockData);

    expect(fs.writeFile).toHaveBeenCalledWith(CACHE_FILE, JSON.stringify(mockResult), 'utf8');
  });
});