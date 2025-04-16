"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10000000') // Default 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});
const setupMiddleware = (app) => {
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    // Body parsing middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    });
    // Make upload middleware available on app
    app.upload = upload;
};
exports.setupMiddleware = setupMiddleware;
