const ErrorResponse = require("../utils/errorResponse");
const Category = require("../model/cetegoryModel");

const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return next(
        new ErrorResponse("category nomini kiritishingiz shart", 400)
      );
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new ErrorResponse("Bu nomdagi category tzimda mavjud", 409));
    }

    const category = await Category.create({ name, description });
    res.status(201).json({
      success: true,
      message: "category qo'shildi",
      category,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

const getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return next(new ErrorResponse("Categoriyalar topilmadi", 404));
    }
    res.status(200).json({
      success: true,
      message: "Categoriyalar",
      categories,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

const deletCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ErrorResponse("Noto'g'ri yoki mavjud bo'lmagan kurs ID", 400)
      );
    }

    const delCat = await Category.findByIdAndDelete(id);
    if (!delCat) {
      return next(
        new ErrorResponse("Bunday ID bilan kategoriya topilmadi", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Kategoriya o'chirildi",
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ErrorResponse("Noto'g'ri yoki mavjud bo'lmagan kurs ID", 400)
      );
    }

    const cat = await Category.findById(id);
    if (!cat) {
      return next(new ErrorResponse("Bu categoryadagi ID topilmadi", 400));
    }

    const catdata = {
      name: name || cat.name,
      description: description || cat.description,
    };

    const editCat = await Category.findByIdAndUpdate(id, catdata, {
      new: true,
    });

    if (!editCat) {
      return next(
        new ErrorResponse("Bunday ID bilan kategoriya topilmadi", 404)
      );
    }
    res.status(200).json({
      success: true,
      message: "category o'zgartirildi",
      category: editCat,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

module.exports = { addCategory, getCategory, deletCategory, updateCategory };
