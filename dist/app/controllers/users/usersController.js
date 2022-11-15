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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUser = exports.secure = exports.logout = exports.auth = exports.login = exports.confirm = exports.signUp = exports.checkUsers = void 0;
const db_client_1 = require("../../db_client");
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer = __importStar(require("nodemailer"));
const jwt = __importStar(require("jsonwebtoken"));
const checkUsers = (req, res) => {
    const test = req.header('authorization');
    console.log(test);
    res.send("Users");
};
exports.checkUsers = checkUsers;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(404).json('Email cannot be empty');
        }
        if (!password) {
            res.status(404).json('Password cannot be empty');
        }
        const passwordHash = yield bcrypt.hash(password, 10);
        if (!passwordHash) {
            res.status(404).json('Password cannot be hashed');
        }
        const queryCheck = {
            text: `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
            values: [email]
        };
        const resultCheck = yield db_client_1.pool.query(queryCheck);
        if (resultCheck.rows[0]) {
            res.status(404).json('Email already exist in DB');
        }
        else {
            const queryAdd = {
                text: `INSERT INTO "users" (email, password) VALUES ($1, $2) RETURNING *`,
                values: [email, passwordHash]
            };
            const resultAdd = yield db_client_1.pool.query(queryAdd);
            // NODEMAILER
            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: process.env.USER_MAIL,
                    pass: process.env.PASSWORD_MAIL
                }
            });
            const token = jwt.sign(resultAdd.rows[0].id, process.env.SECRET_JWT);
            if (token) {
                const tokenWithoutDots = token.replace(/\./g, '-');
                yield transport.sendMail({
                    from: 'Homemademeal <c72e713e5c-b76a9d+1@inbox.mailtrap.io>',
                    to: 'benake83@gmail.com',
                    subject: 'Activation de compte',
                    text: 'Activation de compte',
                    // ENVOYER LE MAIL AU LIEN DE l'APP FRONT AVEC LE TOKEN BACK (USEEFFECT)
                    html: `<p> Cliquez sur le lien pour activer votre compte: <a href="http://localhost:5173/confirm/${tokenWithoutDots}"> Activation </a> </p>` // html body
                });
            }
            return res.status(200).json(resultAdd.rows);
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Sign up failed');
    }
});
exports.signUp = signUp;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenURL = req.params;
        const decoded = jwt.verify(tokenURL.id, process.env.SECRET_JWT);
        const queryUpload = {
            text: `UPDATE "users" SET "is_confirm" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
            values: [true, Number(decoded)]
        };
        const resultCheck = yield db_client_1.pool.query(queryUpload);
        if (resultCheck) {
            const userInfos = {
                id: resultCheck.rows[0].id,
                email: resultCheck.rows[0].email,
                firstName: resultCheck.rows[0].firstName,
                secondName: resultCheck.rows[0].secondName,
                is_confirm: resultCheck.rows[0].is_confirm,
            };
            return res.status(200).json(userInfos);
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Confirm failed');
    }
});
exports.confirm = confirm;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(404).json('Email cannot be empty');
        }
        if (!password) {
            res.status(404).json('Password cannot be empty');
        }
        const queryCheck = {
            text: `SELECT * FROM "users" WHERE "email" ILIKE $1;`,
            values: [email]
        };
        const resultCheck = yield db_client_1.pool.query(queryCheck);
        console.log(resultCheck.rows);
        console.log(resultCheck.rows[0].is_confirm);
        if (resultCheck && resultCheck.rows[0].is_confirm === true) {
            const passwordCheck = yield bcrypt.compare(password, resultCheck.rows[0].password);
            if (passwordCheck) {
                const userInfos = {
                    id: resultCheck.rows[0].id,
                    // email: resultCheck.rows[0].email,
                    firstName: resultCheck.rows[0].firstName,
                    secondName: resultCheck.rows[0].secondName,
                };
                const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
                // return res.status(200).json(userInfos);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Logged success");
            }
            else {
                return res.status(404).json('Please check your password)');
            }
        }
        else {
            return res.status(404).json('Please check your email');
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Login failed');
    }
});
exports.login = login;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            res.status(403).json('Not authorize');
        }
        const data = jwt.verify(token, process.env.SECRET_JWT);
        req.user = {
            id: data.userInfos.id,
            firstName: data.userInfos.firstName,
            secondName: data.userInfos.secondName
        };
        return next();
    }
    catch (err) {
        return res.status(500).json('Authorization failed');
    }
});
exports.auth = auth;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.clearCookie("access_token").status(200).json("Logout");
});
exports.logout = logout;
const secure = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(req.user);
});
exports.secure = secure;
const uploadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, secondName, password } = req.body;
        console.log(firstName, secondName, password);
        if (firstName !== "" && secondName === "" && password === "") {
            const queryChange = {
                text: `UPDATE "users" SET "firstName" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
                values: [firstName, id]
            };
            const resultCheck = yield db_client_1.pool.query(queryChange);
            if (resultCheck) {
                const queryCheckId = {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                };
                const resultCheckId = yield db_client_1.pool.query(queryCheckId);
                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName: resultCheckId.rows[0].firstName,
                };
                const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
            }
            else {
                return res.status(403).json("Cannot change firstname");
            }
        }
        else if (firstName !== "" && secondName !== "" && password === "") {
            const queryChange = {
                text: `UPDATE "users" SET "firstName" = $1, "secondName" = $2, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $3 RETURNING *`,
                values: [firstName, secondName, id]
            };
            const resultCheck = yield db_client_1.pool.query(queryChange);
            if (resultCheck) {
                const queryCheckId = {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                };
                const resultCheckId = yield db_client_1.pool.query(queryCheckId);
                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName: resultCheckId.rows[0].firstName,
                };
                const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
            }
            else {
                return res.status(403).json("Cannot change firstname or secondname");
            }
        }
        else if (firstName !== "" && secondName !== "" && password !== "") {
            const passwordHash = yield bcrypt.hash(password, 10);
            const queryChange = {
                text: `UPDATE "users" SET "firstName" = $1, "secondName" = $2, "password" = $3, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $4 RETURNING *`,
                values: [firstName, secondName, passwordHash, id]
            };
            const resultCheck = yield db_client_1.pool.query(queryChange);
            if (resultCheck) {
                const queryCheckId = {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                };
                const resultCheckId = yield db_client_1.pool.query(queryCheckId);
                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName: resultCheckId.rows[0].firstName,
                };
                const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
            }
            else {
                return res.status(403).json("Cannot change firstname secondname or password");
            }
        }
        else if (firstName === "" && secondName === "" && password !== "") {
            const passwordHash = yield bcrypt.hash(password, 10);
            const queryChange = {
                text: `UPDATE "users" SET "password" = $1, "updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2 RETURNING *`,
                values: [passwordHash, id]
            };
            const resultCheck = yield db_client_1.pool.query(queryChange);
            if (resultCheck) {
                const queryCheckId = {
                    text: `SELECT * FROM "users" WHERE "id" = $1`,
                    values: [id]
                };
                const resultCheckId = yield db_client_1.pool.query(queryCheckId);
                const userInfos = {
                    id: resultCheckId.rows[0].id,
                    firstName: resultCheckId.rows[0].firstName,
                };
                const token = jwt.sign({ userInfos }, process.env.SECRET_JWT);
                return res.cookie("access_token", token, {
                    maxAge: 86400 * 1000,
                    httpOnly: true,
                    secure: false
                }).status(200).json("Update success");
            }
            else {
                return res.status(403).json("Cannot change password");
            }
        }
        else {
            return res.status(200).json("nothing changed");
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json('Upload failed');
    }
});
exports.uploadUser = uploadUser;
