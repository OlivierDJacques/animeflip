// --- Imports ---
const axios = require('axios'); // Imports axios to make outgoing requests to the API
const { handleCORS } = require('./handleCORS.js');  

/** --- Function ---
 * Creates and sends airing anime as an array of anime objects
 * @returns {Array} - Array of the seasonal anime objects
 */
async function seasonalAnime() {
    const response = await axios.get('https://api.myanimelist.net/v2/anime/ranking', {
        headers: {Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}`},
        params: {
            ranking_type: 'airing',
            fields: 'id,title,main_picture,rank,popularity'
        }
    });
    const seasonalAnime = response.data.data.map(anime => anime.node);
    return seasonalAnime;
}

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
    const airingAnime = await seasonalAnime();
    res.status(200).json(airingAnime);
  } 
  catch (err) {
    console.error('/api/seasonalAnime error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = handler;