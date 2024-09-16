# Invoices2 Backend
## Invoices2 is a backend application built using Node.js and Express.js to manage and process invoices. This project provides RESTful APIs for handling invoice-related operations such as creating, updating, deleting, and retrieving invoice data, as well as managing users and authentication.

### Technologies
Node.js: Backend JavaScript runtime.
Express.js: Minimalist web framework for building RESTful APIs.
MongoDB/MySQL/PostgreSQL: (Choose one or adapt) for the database layer.
JWT: Token-based authentication for securing the APIs.
Docker: Containerized development for consistency across environments (optional).
### Installation
Clone the repository:

`
git clone https://github.com/terabajt/invoices2-server.git
`
Navigate to the project directory:

`
cd invoices2-backend
`
Install dependencies:
`
npm install
`

Configure environment variables: Create a .env file in the root directory and add the required variables (e.g., database connection details, JWT secret).

Run the development server:

`
npm run dev
`

API Endpoints
Authentication:
POST /api/auth/register – Register a new user.
POST /api/auth/login – Login a user and get a JWT token.
Invoices:
GET /api/invoices – Get a list of all invoices.
POST /api/invoices – Create a new invoice.
GET /api/invoices/:id – Retrieve a specific invoice by ID.
PUT /api/invoices/:id – Update an invoice by ID.
DELETE /api/invoices/:id – Delete an invoice by ID.
Development
ESLint and Prettier configurations for code linting and formatting.
Nodemon for live-reloading during development.
## Project Repository

![Repository schema](https://github.com/terabajt/invoices2/blob/main/ProjectRepository.png)

# API Documentation

This API provides endpoints for managing users, customers, invoices, and activation.<br />

## Users <br />

Get User by ID <br />
`GET /api/v1/users/:id`<br />
Retrieve user details by providing the user ID.<br />

Register User<br />
`POST /api/v1/users/register`<br />
Register a new user with email, password, and other details.<br />

Login User<br />
`POST /api/v1/users/login`<br />
Authenticate a user by email and password.<br />

Update User<br />
`PUT /api/v1/users/:id`<br />
Update user details by providing the user ID.<br />

Delete User<br />
`DELETE /api/v1/users/:id`<br />
Delete a user by providing the user ID.<br />

Activation<br />
Activate User<br />
`GET /api/v1/activation?token=<activationToken>`<br />
Activate a user account by providing the activation token.<br />

## Customers

Get Customer by ID<br />
`GET /api/v1/customers/:id`<br />
Retrieve customer details by providing the customer ID.<br />

Get Customers for User<br />
`GET /api/v1/customers/foruser/:userId`<br />
Retrieve all customers associated with a specific user.<br />

Create Customer<br />
`POST /api/v1/customers/`
Create a new customer.<br />

Update Customer<br />
`PUT /api/v1/customers/:id`<br />
Update customer details by providing the customer ID.<br />

Delete Customer<br />
`DELETE /api/v1/customers/:id`<br />
Delete a customer by providing the customer ID.<br />

## Invoices

Get Invoice by ID<br />
`GET /api/v1/invoices/:id`<br />
Retrieve invoice details by providing the invoice ID.<br />

Get Invoices for User<br />
`GET /api/v1/invoices/foruser/:userID`<br />
Retrieve all invoices associated with a specific user.<br />

Create Invoice<br />
`POST /api/v1/invoices/`<br />
Create a new invoice.<br />

Update Invoice<br />
`PUT /api/v1/invoices/:id`<br />
Update invoice details by providing the invoice ID.<br />

Delete Invoice<br />
`DELETE /api/v1/invoices/:id`<br />
Delete an invoice by providing the invoice ID.<br />

## Get Number of Invoices<br />

`GET /api/v1/invoices/get/invoicesNumber`
Get the total number of invoices.<br />

## Entry Item Operations<br />

`POST /api/v1/invoices/entryitem`<br />
`PUT /api/v1/invoices/entryitem/:id`<br />
`DELETE /api/v1/invoices/entryitem/:id`<br />
Perform operations (create, update, delete) on entry items associated with invoices.<br />

## Statistics<br />

`GET /api/v1/invoices/statistics/:userID`<br />
Retrieve statistics for invoices associated with a specific user.<br />

# Authorization Documentation

This document provides an overview of the authorization mechanism implemented in the application, as well as details about the store used for managing user sessions.

## Authorization

The authorization mechanism is implemented using JSON Web Tokens (JWT) and the `express-jwt` middleware in the backend, and Angular route guards in the frontend.

### Backend Authorization

In the backend, the `authJwt()` function is used to generate middleware for authenticating HTTP requests. This middleware checks for a valid JWT in the Authorization header of incoming requests. The JWT secret is fetched from the environment variables, and the algorithm used for signing the tokens is HS256.

```javascript
const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [`${api}/users/login`, `${api}/users/register`, /\/activation\/*/],
  });
}

module.exports = authJwt;
```
Contributions
Feel free to fork this repository and submit pull requests. Any suggestions or bug reports are welcome!

License
This project is licensed under the MIT License.
