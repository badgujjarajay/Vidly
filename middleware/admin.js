
module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send("Not allowed to access the target resourse.");
    next();
}