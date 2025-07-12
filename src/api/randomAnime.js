/** --- Functions ---
 * Linear Congruential Generator (LCG), generates a seeded pseudo-random number generator
 * @param {Number} seed - Seed value (e.g., an integer derived from date like YYYYMMDD)
 * @returns {function} - Function that returns a pseudo-random number between 0 and 1
 */
function lcg(seed) {
    const m = 233280, a = 9301, c = 49297;
    let current  = seed;
    return function() { // Updates newState to generate different numbers 
        current  = (a * current  + c) % m;  // Pseudo-random number generator (PRNG) 
        return current / m;    // Dividing here keeps the seed as an integer to ensure that continued generations avoid rounding errors but still returns a number between 0 and 1
    }
}

/**
 * Creates the daily anime selection for a given date
 * @param {Array} topAnimeList - The list of top anime
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Array} - Array of 9 anime objects for the day
 */
function getRandomAnime(topAnimeList, seed) {
  const rand = lcg(seed); // Creates function for a seeded pseudo-random number generator

  for (let i = 0; i < 9; i++) { 
    const j = i + Math.floor(rand() * (topAnimeList.length - i)); // Creates a pseudo-random index from current element to last element
    [topAnimeList[i], topAnimeList[j]] = [topAnimeList[j], topAnimeList[i]];  // Swaps the values at current with random and random with current
  }

  return topAnimeList.slice(0,9);
} 

module.exports = { lcg, getRandomAnime };
