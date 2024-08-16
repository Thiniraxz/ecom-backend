const Product = require("../models/productModel");
const productService = require("../services/productService");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createProduct = catchAsync(async (req, res, next) => {
  let payload = {
    name: req.body.name,
    price: req.body.price,
    image: req.file?.path,
    quantity: req.body.quantity,
  };
  let product = await productService.createProduct({
    ...payload,
  });
  res.status(200).json({
    status: true,
    data: product,
  });
});

exports.getProducts = factory.getAll(Product);

exports.getProductById = catchAsync(async (req, res) => {
  let id = req.params.id;
  let productDetails = await productService.productById(id);
  res.status(200).json({
    status: true,
    data: productDetails,
  });
});

exports.removeProduct = catchAsync(async (req, res) => {
  let id = req.params.id;
  let productDetails = await productService.removeProduct(id);
  res.status(200).json({
    status: true,
    data: productDetails,
  });
});
