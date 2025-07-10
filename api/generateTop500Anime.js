// --- Imports ---
const axios = require('axios'); // Imports axios to make outgoing requests to the API
const { writeCache } = require('./cache.js'); 

/** --- Function ---
 * Fetches top 500 anime from the MAL API and writes it into the cache 
 * @returns {Array} - Array of 500 anime objects
 */
async function generateTop500Anime() {
    const response = await axios.get('https://api.myanimelist.net/v2/anime/ranking', {
        headers: {Authorization: `Bearer ${process.env.MAL_ACCESS_TOKEN}`}, // Access token
        // Fetch parameters
        params: {
          ranking_type: 'bypopularity',
          limit: 500,
          fields: 'id,title,alternative_titles,main_picture,popularity'
        }
    });
    // Parses the anime data, fills topAnimeList, and stores it in the cache 
    topAnimeList = response.data.data.map(anime => anime.node);
    await writeCache(topAnimeList);
    return topAnimeList;
}

module.exports = { generateTop500Anime };