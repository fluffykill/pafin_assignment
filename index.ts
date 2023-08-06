import express, { Express, Request, Response } from "express";
import { UserRouter } from "./src/user/routes";
import dotenv from "dotenv";
import { generateAccessToken } from "./authentication";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(generateAccessToken("pafin"));
});

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
