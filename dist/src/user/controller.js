"use strict";
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
const getUsers = (req, res) => {
    db_1.default.query(queries_1.getUsersQuery, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
        ;
        res.status(200).json(results.rows);
    });
};
exports.getUsers = getUsers;
const getUserById = (req, res) => {
    const id = req.params.id;
    if (!(0, isUUID_1.default)(id)) {
        return res.status(400).send("Please provide a proper id");
    }
    db_1.default.query(queries_1.getUserByIdQuery, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
        ;
        res.status(200).json(results.rows);
    });
};
exports.getUserById = getUserById;
const createUser = (req, res) => {
    const { name, email, password } = req.body;
    if (!(0, isEmail_1.default)(email)) {
        return res.status(400).send("Please provide a proper email");
    }
    bcrypt_1.default
        .hash(password, saltRounds)
        .then(hash => {
        db_1.default.query(queries_1.createUserQuery, [name, email, hash], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
            ;
            res.status(201).send(`User added with ID: ${results.rows[0].id}`);
        });
    })
        .catch(err => {
        console.error(err);
        return res.status(500).send("Password Failed");
    });
};
exports.createUser = createUser;
const updateUser = (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!(0, isUUID_1.default)(id)) {
        return res.status(400).send("Please provide a proper id");
    }
    else if (!(0, isEmail_1.default)(email)) {
        return res.status(400).send("Please provide a proper email");
    }
    bcrypt_1.default
        .hash(password, saltRounds)
        .then(hash => {
        db_1.default.query(queries_1.updateUserQuery, [name, email, hash, id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
            ;
            res.status(200).send(`User modified with ID: ${id}`);
        });
    })
        .catch(err => {
        console.error(err);
        return res.status(500).send("Password Failed");
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const id = req.params.id;
    if (!(0, isUUID_1.default)(req.params.id)) {
        return res.status(400).send("Please provide a proper id");
    }
    db_1.default.query(queries_1.getUserByIdQuery, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }
        ;
        if (!results.rows.length) {
            res.send("User does not exist in the database");
        }
        else {
            db_1.default.query(queries_1.deleteUserQuery, [id], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send(error.message);
                }
                ;
                res.status(200).send(`User deleted with ID: ${id}`);
            });
        }
    });
};
exports.deleteUser = deleteUser;
