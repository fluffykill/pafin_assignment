import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import isUUID from 'validator/lib/isUUID';
import isEmail from 'validator/lib/isEmail';
import pool from '../../db';
import { getUsersQuery, getUserByIdQuery, createUserQuery, updateUserQuery, deleteUserQuery } from './queries';

const saltRounds = process.env.SALTROUNDS || 10;

const getUsers = (req: Request, res: Response) => {
  pool.query(getUsersQuery, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send(error.message);
    };
    res.status(200).json(results.rows);
  });
};

const getUserById = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!isUUID(id)) {
    return res.status(400).send("Please provide a proper id");
  }
  pool.query(getUserByIdQuery, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send(error.message);
    };
    res.status(200).json(results.rows);
  });
};

const createUser = (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!isEmail(email)) {
    return res.status(400).send("Please provide a proper email");
  }
  bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      pool.query(createUserQuery, [name, email, hash], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send(error.message);
        };
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send("Password Failed");
    });
}

const updateUser = (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, password } = req.body
  
  if (!isUUID(id)) {
    return res.status(400).send("Please provide a proper id");
  } else if (!isEmail(email)) {
    return res.status(400).send("Please provide a proper email");
  } 
  bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      pool.query(
        updateUserQuery,
        [name, email, hash, id],
        (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).send(error.message);
          };
          res.status(200).send(`User modified with ID: ${id}`)
        }
      )
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send("Password Failed");
    });
}

const deleteUser = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!isUUID(req.params.id)) {
    return res.status(400).send("Please provide a proper id");
  }
  pool.query(getUserByIdQuery, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send(error.message);
    };
    if (!results.rows.length) {
      res.send("User does not exist in the database");
    } else {
      pool.query(deleteUserQuery, [id], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send(error.message);
        };
        res.status(200).send(`User deleted with ID: ${id}`)
      });
    }
  });
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};