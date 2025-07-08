/** --- Function ---
 * Handles permissions when receiving https requests
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 */
function handleCORS(req, res) {
    const allowedOrigins = [
    'https://animeflip.vercel.app'
    ];

    const origin = req.headers.origin;  
    if (allowedOrigins.includes(origin)) {  
        res.setHeader('Access-Control-Allow-Origin', origin);   // Allows site(s) in origin to access this site
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');   // Limits request to GET and OPTIONS  
        res.setHeader('Vary', 'Origin');    // Seperate responses for different origins  
    }
}

module.exports = { handleCORS };