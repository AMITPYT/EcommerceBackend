const express = require("express");
const router = express.Router();
const Cart = require("../schema/carts")
const { validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser.js")


router.post("/cart/addcart",fetchuser, async (req, res) => {
    try {
        const {productname,description,price,quantity } = req.body;
  
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const cart = new Cart ({
          cartid: req.user.id,
          productname,  
          description,
          price,
          quantity
        });
        const savedcart = await cart.save();
  
        res.json({"Success": "Cart Add Successfully",savedcart});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

router.get('/carts/getcarts', fetchuser, async (req, res) => {
    try {
        const getcart = await Cart.find({ cartid: req.user.id});
        console.log(getcart);
        res.json(getcart)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/updatecart/:id', fetchuser, async (req, res) => {
    try {

        const {quantity} = req.body;
        // Create a new note Object
        const newquantity = {};
        if (quantity) {
            newquantity.quantity = quantity;
        }
        let cart = await Cart.findById(req.params.id);
        // console.log(task);
        if (!cart) {
            return res.status(404).send('Not found');
        }
        cart = await Cart.findByIdAndUpdate(req.params.id, { $set: newquantity }, { new: true })
        // console.log(task);
        res.json({ cart });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/deletecart/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).send('Not found');
        }
        // Allow deletion only if the user own this Notic
        if (cart.userid.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        cart = await Cart.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Task Deleted Successfully", cart: cart });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

module.exports = router;