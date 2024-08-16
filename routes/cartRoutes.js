const express = require("express");
const cartController = require("../controllers/cartController");
const verifyAuth = require("../middlewares/auth");

const router = express.Router();

router.post("/", verifyAuth, cartController.createCart);
router.delete("/", verifyAuth, cartController.deleteCart);
router.get("/", verifyAuth, cartController.getCart);

//route for reducing quantity of an item in the cart
router.patch("/", verifyAuth, cartController.reduceItemCart);
module.exports = router;
