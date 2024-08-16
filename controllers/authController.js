const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const userService = require("../services/userService");
const tokenServices = require("../services/tokenServices");

const createSendToken = (user, statusCode, req, res) => {
  const token = tokenServices.signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newuser = await userService.createUser(req.body);

  createSendToken(newuser, 201, req, res);
});

exports.logout = catchAsync(async (req, res) => {
  const cookies = req.cookies;
  console.log("cookiee value :", cookies);

  if (!cookies?.jwt) {
    return res.status(204).json({ message: "No token found" });
  }

  const refresh_token = cookies.jwt;

  const auth = await userService.findOne(refresh_token);

  // if (!auth) {
  //   return res.status(404).json({ message: `User does not exist...` });
  // }

  // auth.refresh_token = null;
  // result = await auth.save();
  // console.log(result);

  res.clearCookie("jwt");
  res.clearCookie("AccessToken");
  return res.status(200).json({
    message: "Logout successful",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await userService.findOneWithPassword(email);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await userService.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
