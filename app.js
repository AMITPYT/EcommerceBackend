const express = require("express");
require("./db");
const Auth = require("./router/auth");
const Products = require("./router/products");
const Carts = require("./router/carts")
const Details = require("./router/details")
const Orders = require("./router/orders")

const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.use(Auth, Products, Carts, Details, Orders)



app.listen(port, () => {
    console.log(`connection is setup at localhost:${port}`)
})