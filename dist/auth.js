"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const db_client_1 = require("./app/db_client");
require("dotenv/config");
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
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    let userInfos = {};
    try {
        const currentUserQuery = yield db_client_1.pool.query(`SELECT * FROM "users" WHERE "email" ILIKE $1;`, [profile._json.email]);
        if (currentUserQuery.rows.length === 0) {
            console.log("salut");
            const passwordHash = yield bcrypt.hash(profile._json.sub, 10);
            yield db_client_1.pool.query(`INSERT INTO "users" (email, password, is_confirm) VALUES ($1, $2, $3) RETURNING *`, [profile._json.email, passwordHash, profile._json.email_verified]);
            const userQuery = yield db_client_1.pool.query(`SELECT * FROM "users" WHERE "email" ILIKE $1;`, [profile._json.email]);
            userInfos = {
                id: userQuery.rows[0].id,
                firstName: profile._json.given_name,
                googleAuth: true,
            };
        }
        else {
            userInfos = {
                id: currentUserQuery.rows[0].id,
                firstName: profile._json.given_name,
                googleAuth: true,
            };
            console.log("test1 : " + userInfos);
        }
        done(null, userInfos);
    }
    catch (err) {
        done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    // loads into req.session.passport.user
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    // loads into req.user
    done(null, user);
});
