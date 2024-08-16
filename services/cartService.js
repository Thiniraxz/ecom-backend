const Cart = require("../models/cartModel");
const Item = require("../models/itemModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

exports.findCart = async (owner) => {
  const cart = await Cart.findOne({ owner });
  return cart;
};

exports.createCart = async (owner, itemId, quantity, next) => {
  const cart = await Cart.findOne({ owner });
  const item = await Product.findOne({ _id: itemId });

  if (!item) {
    return next(new AppError("item not found", 404));
  }

  const price = item.price;
  const name = item.name;

  //If cart already exists for user,
  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    //check if product exists or not
    if (itemIndex > -1) {
      let product = cart.items[itemIndex];
      product.quantity += quantity;
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      cart.items[itemIndex] = product;
      await cart.save();
      return { status: 200, cart };
    } else {
      cart.items.push({ itemId, name, quantity, price });
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      await cart.save();
      return { status: 200, cart };
    }
  } else {
    //no cart exists, create one
    const newCart = await Cart.create({
      owner,
      items: [{ itemId, name, quantity, price }],
      bill: quantity * price,
    });

    await newCart.save();
    return { status: 201, cart: newCart };
  }
};

exports.deleteItem = async (owner, itemId, next) => {
  let cart = await Cart.findOne({ owner });
  const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    cart.bill -= item.quantity * item.price;

    if (cart.bill < 0) {
      cart.bill = 0;
    }

    cart.items.splice(itemIndex, 1);
    cart.bill = cart.items.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);
    cart = await cart.save();
    return { cart };
  } else {
    return next(new AppError("Item not found", 404));
  }
};

exports.changeQuantity = async (owner, itemId, quantity, type, next) => {
  const cart = await Cart.findOne({ owner });
  const item = await Product.findOne({ _id: itemId });

  if (!item) {
    return next(new AppError("item not found", 404));
  }

  //If cart already exists for user,
  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    //check if product exists or not
    if (itemIndex > -1) {
      let product = cart.items[itemIndex];
      if (type == "increase") {
        product.quantity += quantity;
        cart.bill += quantity * item.price;
      } else {
        product.quantity -= quantity;
        if (product.quantity < 0) {
          return next(new AppError("Quantity cannot be less than 0", 400));
        }
        cart.bill -= quantity * item.price;

        if (cart.bill < 0) {
          cart.bill = 0;
        }
      }
      cart.items[itemIndex] = product;
      await cart.save();
      return { status: 200, cart };
    } else {
      return next(new AppError("Item not found in cart", 404));
    }
  } else {
    return next(new AppError("Cart not found for user", 404));
  }
};
