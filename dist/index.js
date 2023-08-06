"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./src/user/routes");
const dotenv_1 = __importDefault(require("dotenv"));
const authentication_1 = require("./authentication");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send((0, authentication_1.generateAccessToken)("pafin"));
});
app.use("/api/user", routes_1.UserRouter);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
