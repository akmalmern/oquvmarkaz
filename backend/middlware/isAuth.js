const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const ErrorResponse = require("../utils/errorResponse");

const isAuthenticated = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next(new ErrorResponse("Token muddati tugagan+", 401));
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    req.user = await userModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.message === "jwt expired") {
      res.clearCookie("accessToken");
      return next(new ErrorResponse("Token muddati tugagan.", 401));
    }

    return next(new ErrorResponse("Server xatosi: " + error.message, 500));
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new ErrorResponse("Faqat adminlar uchun ruxsat berilgan", 403)
      );
    }
    next();
  } catch (error) {
    next(new ErrorResponse(`Server xatosi: ${error.message}`, 500));
  }
};

module.exports = { isAuthenticated, isAdmin };
