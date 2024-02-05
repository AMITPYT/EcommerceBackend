const express = require("express");
const router = express.Router();
const Details = require("../schema/details")
const { validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser.js")


router.post("/details/adddetails",fetchuser, async (req, res) => {
    try {
        const {name,address,number,second_number,pincode } = req.body;
        const find = await Details.findOne({number})
        const findSec = await Details.findOne({second_number})
        if(find){
            return res.json({error: "number already register"})
        }
        if(findSec){
            res.json({error: "Second_number already register"})
        }
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const details = new Details ({
          userid: req.user.id,
          name,
          address,  
          number,
          second_number,
          pincode
        });
        const saveddetails = await details.save();
  
        res.json({"Success": "Cart Add Successfully",saveddetails});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
});

router.get('/details/getdetails', fetchuser, async (req, res) => {
    try {
        const getdetails = await Details.find({ userid: req.user.id});
        console.log(getdetails);
        res.json(getdetails)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/updatedetails/:id', fetchuser, async (req, res) => {
    try {

        const {address,number,second_number,pincode} = req.body;
        // Create a new note Object
        const newdetails = {};
        if (address) {
            newdetails.address = address;
        }
        if (number) {
            newdetails.number = number;
        }
        if (second_number) {
            newdetails.second_number = second_number;
        }
        if (pincode) {
            newdetails.pincode = pincode;
        }
        let detail = await Details.findById(req.params.id);
        // console.log(task);
        if (!detail) {
            return res.status(404).send('Not found');
        }
        // note.user.toString is given the user id 
        if (detail.userid.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        detail = await Details.findByIdAndUpdate(req.params.id, { $set: newdetails }, { new: true })
        // console.log(task);
        res.json({ cart });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/getdata', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it

        let cart = await Details.find({userid: req.user.id});
        if (!cart) {
            return res.status(404).send('Not found');
        }
        cart = await Details.aggregate([
            {
                 $lookup:
                {
                   from: "carts",
                   localField: "userid",
                   foreignField: "cartid",
                   as: "carts"
                }
            }
        ])
        if(!cart){
            return res.status(404).send('Something went wrong');
        }
        res.json({ "Success": " Successfully", cart });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

router.get('/getdata', async (req, res) => {
    try {
        const getproducts = await Details.findById(req.user.id);
        res.json(getproducts)
        if (!getproducts) {
            return res.status(404).send('Not found');
        }
        getproducts = await Details.aggregate([
            {
                 $lookup:
                {
                   from: "carts",
                   localField: "userid",
                   foreignField: "cartid",
                   as: "carts"
                }
            }
        ])
        if(!getproducts){
            return res.status(404).send('Something went wrong');
        }
        res.json({ "Success": " Successfully", getproducts });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/getdata/:userId', async (req, res) => {
    try {
        // Find details for the specific user
        const userDetails = await Details.findOne({ userid: req.params.userId });

        // Check if user details exist
        if (!userDetails) {
            return res.status(404).send('User details not found');
        }
        

        // Use the user ID from userDetails to perform $lookup in the "carts" collection
        const getProducts = await Details.aggregate([
            {
                $match: { _id: userDetails._id } // Match by user ID
            },
            {
                $lookup: {
                    from: "carts",
                    localField: "_id", // User ID from "Details" collection
                    foreignField: "cartid",
                    as: "carts"
                }
            }
        ]);

        // Check if the result is not empty
        if (!getProducts || getProducts.length === 0) {
            return res.status(404).send('No data found');
        }

        // Send the result as JSON
        res.json({ success: 'Successfully', getProducts });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;