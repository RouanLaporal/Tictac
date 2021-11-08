const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get auth header value
    const header = req.headers['authorization'];
    // Check if header is undefined
    if (typeof header !== 'undefined') {
        // Set the token
        req.token = header;
        // Next 
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
};