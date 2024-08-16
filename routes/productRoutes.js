const express = require("express");
const productController = require("../controllers/productController");
const multer = require("../config/multer");

const router = express.Router();

router.post(
  "/",
  // multer.upload.single("image"),
  productController.createProduct
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.removeProduct);

module.exports = router;
