const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/userModel");
const Kurslar = require("../model/kursModel");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password ");
    if (users.length === 0) {
      return next(new ErrorResponse("Foydalanuvchilar topilmadi", 404));
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // "admin" yoki "student"

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("Noto'g'ri foydalanuvchi ID", 400));
    }

    if (!["admin", "student"].includes(role)) {
      return next(new ErrorResponse("Noto'g'ri rol qiymati", 400));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
    }

    res.status(200).json({
      success: true,
      message: "Foydalanuvchi roli yangilandi",
      user,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

// kursni tasdiqlash
const kursniTasdiqlash = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("Noto‘g‘ri kurs ID", 400));
    }

    const kurs = await Kurslar.findByIdAndUpdate(
      id,
      { status: "active" }, // "pending" dan "active" ga o‘tkazish
      { new: true, runValidators: true }
    )
      .populate("talabalar", "firstName lastName email")
      .populate("category", "name description");

    if (!kurs) {
      return next(new ErrorResponse("Kurs topilmadi", 404));
    }

    res.status(200).json({
      success: true,
      message: "Kurs tasdiqlandi",
      data: kurs,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalKurslar = await Kurslar.countDocuments();
    const popularKurslar = await Kurslar.aggregate([
      { $project: { title: 1, studentCount: { $size: "$talabalar" } } },
      { $sort: { studentCount: -1 } },
      { $limit: 5 },
    ]);

    const analytics = {
      totalUsers,
      totalKurslar,
      popularKurslar,
    };

    res.status(200).json({
      success: true,
      message: "Tizim analitikasi",
      data: analytics,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorResponse("Noto'g'ri foydalanuvchi ID", 400));
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
    }

    // Agar foydalanuvchi kurslarda bo‘lsa, undan chiqarish
    await Kurslar.updateMany({ talabalar: id }, { $pull: { talabalar: id } });

    res.status(200).json({
      success: true,
      message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

module.exports = {
  deleteUser,
  getUsers,
  getAnalytics,
  kursniTasdiqlash,
  updateUserRole,
};
