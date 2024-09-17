import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

dotenv.config();

const API = process.env.API_URL;
const PORT = process.env.PORT;

const app = express();

//INIT CORS
app.use(cors());
app.options("*", cors());

//JWT
import authJwt from "./helpers/jwt.js";

//MIDDLEWARE CONFIG
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());

//IMPORT ROUTES
import activationRoutes from "./routes/activation.js";
import customersRoutes from "./routes/customers.js";
import invoicesRoutes from "./routes/invoices.js";
import usersRoutes from "./routes/users.js";
//ROUTES
app.use(`${API}/users`, usersRoutes);
app.use(`${API}/invoices`, invoicesRoutes);
app.use(`${API}/customers`, customersRoutes);
app.use(`${API}/activation`, activationRoutes);

//MONGOOSE CONNECT
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Connected to database OK");
  })
  .catch((err) => {
    console.log(err);
  });

//MAIN
app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
