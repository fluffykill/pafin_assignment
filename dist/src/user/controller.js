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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const isUUID_1 = __importDefault(require("validator/lib/isUUID"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const db_1 = __importDefault(require("../../db"));
const queries_1 = require("./queries");
const saltRounds = process.env.SALTROUNDS || 10;
// TODO: Update to support pagination instead of returning entire users table
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield db_1.default.query(queries_1.getUsersQuery);
        res.status(200).json(results.rows);
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Failed to get users");
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!(0, isUUID_1.default)(id)) {
        return res.status(400).send("Please provide a proper id");
    }
    try {
        const result = yield db_1.default.query(queries_1.getUserByIdQuery, [id]);
        res.status(200).json(result.rows);
    }
    catch (e) {
        console.error(e);
        res.status(500).send(`Failed to get user with id: ${id}`);
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!(0, isEmail_1.default)(email)) {
        return res.status(400).send("Please provide a proper email");
    }
    try {
        const user = yield db_1.default.query(queries_1.getUserByEmailQuery, [email]);
        if (user.rows.length) {
            res.status(400).send("User with this email already exists.");
        }
        else {
            const hash = yield bcrypt_1.default.hash(password, saltRounds);
            const result = yield db_1.default.query(queries_1.createUserQuery, [name, email, hash]);
            res.status(201).send(`User added with id: ${result.rows[0].id}`);
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send("Failed to create new user");
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!(0, isUUID_1.default)(id)) {
        return res.status(400).send("Please provide a proper id");
    }
    else if (!(0, isEmail_1.default)(email)) {
        return res.status(400).send("Please provide a proper email");
    }
    try {
        const user = yield db_1.default.query(queries_1.getUserByEmailQuery, [email]);
        if (user.rows.length && user.rows.every((row) => row.id != id)) {
            res.status(400).send("User with this email already exists.");
        }
        else {
            const hash = yield bcrypt_1.default.hash(password, saltRounds);
            const result = yield db_1.default.query(queries_1.updateUserQuery, [name, email, hash, id]);
            res.status(200).send(`User modified with id: ${id}`);
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send(`Failed to modify user with id: ${id}`);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!(0, isUUID_1.default)(req.params.id)) {
        return res.status(400).send("Please provide a proper id");
    }
    try {
        const result = yield db_1.default.query(queries_1.getUserByIdQuery, [id]);
        if (!result.rows.length) {
            res.status(400).send("User does not exist in the database");
        }
        else {
            yield db_1.default.query(queries_1.deleteUserQuery, [id]);
            res.status(200).send(`User deleted with id: ${id}`);
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send(`Failed to delete user with id: ${id}`);
    }
});
exports.deleteUser = deleteUser;
