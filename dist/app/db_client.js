"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
require("dotenv/config");
// export const pool = new Pool({
//     user: "homemademeal",
//     host: "localhost",
//     password: process.env.PASSWORD_DB,
//     database: "homemademeal",
//     port : 5432
// })
exports.pool = new pg_1.Pool({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    port: process.env.PORT_DB
});
