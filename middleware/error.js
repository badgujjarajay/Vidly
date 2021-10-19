module.exports = function (logger) {
    return async (err, req, res, next) => {
        // LOG the exception
        logger.error(err.message, err);
        res.status(500).send("Something failed.");
    }
}