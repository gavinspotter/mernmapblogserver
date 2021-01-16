const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const error = new HttpError('Authentication failed', 401)
        return next(error)
    }
}