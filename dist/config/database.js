"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [path_1.default.join(__dirname, '..', 'models', '*.{ts,js}')],
    migrations: [path_1.default.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    subscribers: [path_1.default.join(__dirname, '..', 'subscribers', '*.{ts,js}')]
});
