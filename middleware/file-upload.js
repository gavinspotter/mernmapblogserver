const multer = require("multer")

const MIMI_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
}
const fileUpload = multer({
    limits: 5000000,
    storage: multer.diskStorage({
        destination: (req, file, cb)=> {},
        filename: (req, file, cb) => {}
    })
})

module.exports = fileUpload