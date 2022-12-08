
import passport from "passport";
import passportGoogle from "passport-google-oauth20";
const GoogleStrategy = passportGoogle.Strategy;

import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { pool } from "./app/db_client";

import 'dotenv/config';

// passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID ,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/auth/google/callback",
//       },
//       (accessToken: any, refreshToken: any, profile: any, done: any) => {
//         try {
//             console.log("ici")
//             console.log(profile)
//         }catch(err){
//             console.log(err)
//         }
//       }
//     )
//   );

passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID ,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        },
        async (accessToken: any, refreshToken: any, profile: any, done: any) => {
            let userInfos = {};
            try {
                const currentUserQuery = await pool.query(
                    `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
                    [profile._json.email]
                )
                if(currentUserQuery.rows.length === 0){
                    console.log("salut")
                    const passwordHash: any = await bcrypt.hash(profile._json.sub, 10);
                    await pool.query(
                        `INSERT INTO "users" (email, password, is_confirm) VALUES ($1, $2, $3) RETURNING *`,
                        [profile._json.email, passwordHash, profile._json.email_verified]
                    );
                    const userQuery = await pool.query(
                        `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
                        [profile._json.email]
                    );
                    

                    userInfos = {
                        id: userQuery.rows[0].id,
                        firstName: profile._json.given_name,
                    };
                    
                } else {

                    userInfos = {
                        id: currentUserQuery.rows[0].id,
                        firstName: profile._json.given_name,
                    };

                    console.log("test1 : " +userInfos)
                }

                done(null, userInfos);
            }catch(err){
                done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    // loads into req.session.passport.user
    done(null, user);
});
  
  passport.deserializeUser((user, done) => {
    // loads into req.user
    done(null, user as any);
});