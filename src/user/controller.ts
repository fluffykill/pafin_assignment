import { Request, Response } from "express";
import bcrypt from "bcrypt";
import isUUID from "validator/lib/isUUID";
import isEmail from "validator/lib/isEmail";
import pool from "../../db";
import {
  getUsersQuery,
  getUserByIdQuery,
  createUserQuery,
  updateUserQuery,
  deleteUserQuery,
} from "./queries";

const saltRounds = process.env.SALTROUNDS || 10;

// TODO: Update to support pagination instead of returning entire users table
const getUsers = async (req: Request, res: Response) => {
  try {
    const results = await pool.query(getUsersQuery);
    res.status(200).json(results.rows);
  } catch (e) {
    console.error(e);
    res.status(500).send("Failed to get users");
  }
};

const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isUUID(id)) {
    return res.status(400).send("Please provide a proper id");
  }

  try {
    const result = await pool.query(getUserByIdQuery, [id]);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).send(`Failed to get user with id: ${id}`);
  }
};

const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!isEmail(email)) {
    return res.status(400).send("Please provide a proper email");
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(createUserQuery, [name, email, hash]);
    res.status(201).send(`User added with id: ${result.rows[0].id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Failed to create new user");
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  if (!isUUID(id)) {
    return res.status(400).send("Please provide a proper id");
  } else if (!isEmail(email)) {
    return res.status(400).send("Please provide a proper email");
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(updateUserQuery, [name, email, hash, id]);
    res.status(200).send(`User modified with id: ${id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send(`Failed to modify user with id: ${id}`);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isUUID(req.params.id)) {
    return res.status(400).send("Please provide a proper id");
  }

  try {
    const result = await pool.query(getUserByIdQuery, [id]);
    if (!result.rows.length) {
      res.status(400).send("User does not exist in the database");
    } else {
      await pool.query(deleteUserQuery, [id]);
      res.status(200).send(`User deleted with id: ${id}`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(`Failed to delete user with id: ${id}`);
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
