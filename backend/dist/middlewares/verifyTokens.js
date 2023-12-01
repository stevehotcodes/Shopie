"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPrivilege = exports.accountRequired = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const verifyToken = (req, res, privilege = false) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(401).json({
                message: "You do not have access",
            });
        }
        const decodedUserData = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.info = decodedUserData;
        if (privilege && decodedUserData.role !== privilege) {
            return res.status(401).json({ message: "Unauthorised" });
        }
    }
    catch (error) {
        return res.json({
            message: error.message,
        });
    }
    return false;
};
exports.verifyToken = verifyToken;
const accountRequired = (req, res, next) => {
    const error = (0, exports.verifyToken)(req, res);
    if (error) {
        return error;
    }
    next();
};
exports.accountRequired = accountRequired;
const adminPrivilege = (req, res, next) => {
    const error = (0, exports.verifyToken)(req, res, 'admin');
    if (error) {
        return error;
    }
    next();
};
exports.adminPrivilege = adminPrivilege;
//# sourceMappingURL=verifyTokens.js.map