import express, { Express } from 'express';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended : false }))


import 'dotenv/config';
// Définition du PORT
const PORT = process.env.PORT || 1234;


// Mise en place du router 
import router from "./app/router";
app.use(router)



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
