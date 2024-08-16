const cartService = require("../services/cartService");
const itemService = require("../services/itemService");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getCart = catchAsync(async (req, res, next) => {
  const owner = req.user.id;

  const cart = await cartService.findCart(owner);
  console.log(cart);
  if (cart && cart.items.length > 0) {
    res.status(200).json({ data: cart });
  } else {
    res.status(200).json({ data: null });
  }
});

exports.createCart = catchAsync(async (req, res, next) => {
  const owner = req.user._id;
  const { itemId, quantity } = req.body;

  const { status, cart } = await cartService.createCart(
    owner,
    itemId,
    quantity,
    next
  );
  res.status(status).json({ status: "success", cart });
});

exports.reduceItemCart = catchAsync(async (req, res, next) => {
  const owner = req.user._id;
  const { itemId, quantity, type } = req.body;

  const { status, cart } = await cartService.changeQuantity(
    owner,
    itemId,
    quantity,
    type,
    next
  );
  res.status(status).json({ status: "success", cart });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const owner = req.user._id;
  const itemId = req.query.itemId;

  const cart = await cartService.deleteItem(owner, itemId, next);
  res.status(200).json({
    status: true,
    data: cart,
  });
});
