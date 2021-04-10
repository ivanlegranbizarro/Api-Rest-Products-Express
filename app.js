const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Conexión Base de datos

const uri = `mongodb+srv://legran:${process.env.PASSWORD}@cluster0.36olv.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

// Middlewares

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar las rutas

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

app.use(cors());

// Rutas que manejan peticiones
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

// Inicio del servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
});
