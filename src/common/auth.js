const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Extract token from the "Authorization" header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, 'shhhh', (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.userId = decodedToken.userId; // Setting the userId in the request object for further use
        next(); // Calling the next middleware 
    });
}



module.exports = authenticateToken;


