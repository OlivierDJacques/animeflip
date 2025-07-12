// --- Imports ---
const fs = require('fs/promises');  // Imports promises to read and write files asynchronously 
const CACHE_FILE = '/tmp/top500.json';
const CACHE_TIME = 86400; // 24 hours in seconds

/** --- Function ---
 * Returns the top 500 anime from the cache if it is there and if it isn't time for a cache reset 
 * @returns {object|null} - parsed cache object or null
 */
async function readCache() {
  try {
    const stat = await fs.stat(CACHE_FILE); // Extract stats of the cache file
    const age = (Date.now() - stat.mtimeMs) / 1000; // Caculate the age of the cache

    // Check if it is time for a cache reset if not return the cached list
    if (age < CACHE_TIME) {
      const raw = await fs.readFile(CACHE_FILE, 'utf8');
      return JSON.parse(raw);
    } 
  } 
  catch (err) { 
  }
  
  return null;
}

/**
 * Writes into the cache file the top anime list and a timestamp
 * @param {Array} topAnimeList - The list of top anime
 */
async function writeCache(topAnimeList) {
  // Creates an array to store the top anime list and the time it was made
  const data = {
    topAnimeList,
    timestamp: Math.floor(Date.now() / 1000)
  };
  
  await fs.writeFile(CACHE_FILE, JSON.stringify(data), 'utf8');  // Stores the newly created array into the cache file
}

module.exports = { readCache, writeCache, CACHE_TIME };