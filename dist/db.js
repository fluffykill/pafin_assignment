"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const user = process.env.DBUSER;
const password = process.env.DBPASS;
const pool = new Pool({
    user,
    host: "localhost",
    database: "pafin",
    password,
    port: 5432,
});
exports.default = pool;
