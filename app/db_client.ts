import { Pool } from "pg";

import 'dotenv/config';

export const pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    port: process.env.PORT_DB
})
