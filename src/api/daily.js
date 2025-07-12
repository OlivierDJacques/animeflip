// --- Imports ---
const { readCache, CACHE_TIME } = require('./cache.js');  
const { handleCORS } = require('./handleCORS.js');  
const { generateTop500Anime } = require('./generateTop500Anime.js');  
const { getRandomAnime } = require('./randomAnime.js');  

/** --- Endpoint ---
 * Creates and sends the daily anime selection for the current date
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
async function handler(req, res) {
  handleCORS(req, res);

  if (req.method == 'OPTIONS') {  // Checks if it is being sent an OPTIONS request (preflight request)
    res.status(200).end();  // Confirms success and ends connection
    return; 
  }
  
  try {
    const now = Math.floor(Date.now() / 1000); // Stores current time in seconds 
    const cache = await readCache();  // Gets data from cache
    let topAnimeList;
    
    // Checks if cache has data and if cache is due for a reset
    if (cache && (now - cache.timestamp < CACHE_TIME)) {  
      topAnimeList = cache.topAnimeList;
    } 
    else { 
      topAnimeList = await generateTop500Anime();
    }

    // Gets current date and converts to numeric values only, creates daily array of anime then sends json file for dailies
    const date = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const seed = Number(date.replace(/-/g, ''));  
    res.status(200).json(getRandomAnime(topAnimeList, seed));  
  } 
  catch (err) {
    console.error('/api/daily error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;