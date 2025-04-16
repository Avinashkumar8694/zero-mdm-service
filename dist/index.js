"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const routes_1 = require("./routes");
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Setup middleware
(0, middleware_1.setupMiddleware)(app);
// Setup routes
(0, routes_1.setupRoutes)(app);
// Initialize database connection
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to database:', error);
});
