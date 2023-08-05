import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';
import isJWT from 'validator/lib/isJWT';


const generateAccessToken = (username:string) => {
  return jwt.sign(username, process.env.TOKENSECRET!);
}

const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers['authorization'] || '';

  if (!isJWT(token)) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKENSECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    next()
  })
}

export {
  authenticateToken,
  generateAccessToken
};