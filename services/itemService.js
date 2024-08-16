const Item = require("../models/itemModel");

exports.findItem = async (owner) => {
  const item = await Item.findOne({ owner });
  return item;
};
