const jwt = require('jsonwebtoken')

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            const error = new HttpError('Authentication failed', 401)
            return next(error)
        }

        const decodedToken = jwt.verify(token, 'supersecret_dont_share')
    } catch (err) {
        const error = new HttpError("authorization failed", 401)
        return next(error)
    }

}