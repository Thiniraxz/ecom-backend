const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../services/apiFeatures");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
