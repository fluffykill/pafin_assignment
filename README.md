## Description

Pafin Assignment

## Installation

Run to install all the required modules
```bash
$ npm install
```
Create a .env file in the root folder with
```
PORT=3000
DBUSER=<pgsql user>
DBPASS=<pgsql password>
SALTROUNDS=<salt rounds for passwords, default is 10>
TOKENSECRET=<secret for generating jwt>
```

## Running the app

**Expects postgres to be running locally at port 5432 with a db called pafin and a users table containing columns id(UUID), name(varchar), email(varchar), password(varchar)**


```bash
# development
$ npm run dev

# production mode
$ npm start
```

## Endpoints
**For user endpoints include the jwt in the authentication header**

### Get /
Returns a jwt token to use for authenticating the endpoints

### Get /api/user
Returns all users in the database

### Get /api/user/:id
Returns the user with the given id

### Post /api/user/
Creates a new user returns it's uuid
```
Request Body
{
  "name":
  "email":
  "password":
}
```
### Put /api/user/:id
Updates the user with the given id
```
Request Body
{
  "name":
  "email":
  "password":
}
```

### Delete /api/user/:id
Deletes the user with the given id

## Testing
Using Postman it is possible to test each endpoint at http://localhost:3000/
