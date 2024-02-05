const express = require("express");
const router = express.Router();
const Product = require("../schema/products")
const { validationResult } = require("express-validator");


router.post("/products/addproducts", async (req, res) => {
    try {
        const {productname,description,price } = req.body;
  
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const products = new Product ({
          productname,  
          description,
          price,
        });
        const savedproducts = await products.save();
  
        res.json({"Success": "Product Add Successfully",savedproducts});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

router.get('/products/getproducts', async (req, res) => {
    try {
        const getproducts = await  Product.find();
        console.log(getproducts);
        res.json(getproducts)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/products/getproductsbyname', async (req, res) => {
    try {
        const getproducts = await Product.find({productname: req.body.productname});
        res.json(getproducts)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;