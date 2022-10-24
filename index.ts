import express, { Express } from 'express';
import session from 'express-session';
const app: Express = express();

import "./auth";


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : false }))


import cors from 'cors';
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
}));

import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());

import 'dotenv/config';
// Définition du PORT
const PORT = process.env.PORT || 1234;


// Mise en place du router 
import router from "./app/router";
app.use(router)



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
