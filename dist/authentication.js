"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isJWT_1 = __importDefault(require("validator/lib/isJWT"));
const generateAccessToken = (username) => {
    return jsonwebtoken_1.default.sign(username, process.env.TOKENSECRET);
};
exports.generateAccessToken = generateAccessToken;
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"] || "";
    if (!(0, isJWT_1.default)(token))
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.TOKENSECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        next();
    });
};
exports.authenticateToken = authenticateToken;
