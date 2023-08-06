const getUsersQuery = "SELECT * FROM users";

const getUserByIdQuery = "SELECT * FROM users WHERE id = $1";

const getUserByEmailQuery = "SELECT * FROM users WHERE email = $1";

const createUserQuery =
  "INSERT INTO users (id, name, email, password) VALUES (gen_random_uuid (),$1, $2, $3) RETURNING *";

const updateUserQuery =
  "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4";

const deleteUserQuery = "DELETE FROM users WHERE id = $1";

export {
  getUsersQuery,
  getUserByIdQuery,
  getUserByEmailQuery,
  createUserQuery,
  updateUserQuery,
  deleteUserQuery,
};
