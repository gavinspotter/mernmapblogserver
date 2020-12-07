const multer = require("multer")

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
}
const fileUpload = multer({
    limits: 5000000,
    storage: multer.diskStorage({
        destination: (req, file, cb)=> {

        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]
        }
    })
})

module.exports = fileUpload