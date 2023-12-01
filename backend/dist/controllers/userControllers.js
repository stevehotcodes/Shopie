"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getSignedInUser = exports.getAUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const validators_1 = require("../validators/validators");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mssql_1 = __importDefault(require("mssql"));
const dbConfig_1 = require("../config/dbConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const baseUrl = "http://localhost:3000";
const APPHOST = process.env.APPHOST || 'http://localhost';
const PORT = process.env.PORT || 3000;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { firstname, lastname, email, password } = req.body;
        let { error } = validators_1.registerUserSchema.validate(req.body);
        if (error) {
            return res.status(404).json({ error: error.details });
        }
        const emailTaken = (yield dbhelpers_1.default.query(`SELECT * FROM users where email = '${email}'`)).recordset;
        if (!(0, lodash_1.isEmpty)(emailTaken)) {
            return res.json({ error: "This email is already in use" });
        }
        let id = (0, uuid_1.v4)();
        const hashedPwd = yield bcrypt_1.default.hash(password, 5);
        let result = dbhelpers_1.default.execute("userRegistration", {
            id,
            firstname,
            lastname,
            email,
            password: hashedPwd,
        });
        console.log(result);
        if ((yield result).rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Something went wrong, employee not registered"
            });
        }
        else {
            return res.status(201).json({
                message: "User registered successfully"
            });
        }
        return res.status(200).json({
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const pool = yield mssql_1.default.connect(dbConfig_1.dbConfig);
        let user = (yield pool
            .request()
            .input("email", email)
            .input("password", password)
            .execute("loginUser"));
        console.log(user);
        if (!user.recordset.length) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const _a = user.recordset[0], { password: storedPassword } = _a, rest = __rest(_a, ["password"]);
        console.log(rest);
        const correctPwd = yield bcrypt_1.default.compare(password, storedPassword);
        if (!correctPwd) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign(rest, process.env.SECRET_KEY, {
            expiresIn: "34000s",
        });
        console.log(token);
        return res.status(200).json({ message: "LogIn successful", token, email, role: rest.role });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = (yield dbhelpers_1.default.execute('getAllUsers')).recordset;
        if (!users) {
            return res.status(404).json({ message: "No customers found" });
        }
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getAUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let user = (yield dbhelpers_1.default.execute('getAUserById', { id })).recordset[0];
        if (!user) {
            return res.status(404).json({ message: "No customer found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAUserById = getAUserById;
const getSignedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.info) === null || _b === void 0 ? void 0 : _b.id;
        let user = (yield dbhelpers_1.default.execute('getAUserById', { id })).recordset[0];
        if (!user) {
            return res.status(404).json({ message: "No customer found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getSignedInUser = getSignedInUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let id = (_c = req.info) === null || _c === void 0 ? void 0 : _c.id;
        let { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'required values are missing kindly check again' });
        }
        let user = yield (yield dbhelpers_1.default.execute('getAUserById', { id })).recordset[0];
        if (!user) {
            return res.status(404).json({ message: 'The user does not exist' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield dbhelpers_1.default.execute('updateUser', { id, firstname, lastname, email, password: hashedPassword });
        return res.status(200).json({ message: "the user's details was updated successfully " });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=userControllers.js.map