"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
require("./auth");
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
// Session
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    // cookie: {secure: true} 
}));
// COOKIE
app.use((0, cookie_parser_1.default)());
const passport_1 = __importDefault(require("passport"));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
require("dotenv/config");
// Définition du PORT
const PORT = process.env.PORT || 1234;
// Mise en place du router 
const router_1 = __importDefault(require("./app/router"));
app.use(router_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
