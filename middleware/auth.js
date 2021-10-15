const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.send(401).send("Access denied. No token provided.");
    
    try {
        const decode = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decode;
        next();
    }
    catch (ex) {
        res.send(400).send("Invalid token.");
    }
}