const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, "..", "..", "tmp");  // Caminho para a pasta tmp fora do src
        cb(null, uploadPath);  // Destino do upload
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString("hex");
        const originalName = file.originalname.replace(/\s+/g, "_"); // Remover espaços do nome
        cb(null, `${uniqueSuffix}-${originalName}`);
    }
});

const fileFilter = (req, file, cb) => {
    console.log("📂 Tipo de arquivo recebido:", file.mimetype);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de arquivo não permitido"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Limite de 2MB
});

module.exports = upload;
