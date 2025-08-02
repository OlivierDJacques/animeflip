// --- Imports ---
const { readCache, CACHE_TIME } = require('./cache.js');  
const { handleCORS } = require('./handleCORS.js');  
const { generateTop500Anime } = require('./generateTop500Anime.js');  

/** --- Endpoint ---
 * Creates and sends top 500 anime as an array of anime objects
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP request object
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

    res.status(200).json(topAnimeList);
  } 
  catch (err) {
    console.error('/api/top500 error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;