const ErrorResponse = require("../utils/errorResponse");
const Kurslar = require("../model/kursModel");

const addKurs = async (req, res, next) => {
  const { title, description, davomiyligi, narxi, category } = req.body;

  if (!title || !description || !davomiyligi || !narxi || !category) {
    return next(new ErrorResponse("Maydonni to'liq to'ldiring", 400));
  }

  try {
    const existKurs = await Kurslar.findOne({ title });
    if (existKurs) {
      return next(new ErrorResponse("Bu kurs tzimda mavjud", 409));
    }

    if (narxi < 0 || davomiyligi < 0) {
      return next(
        new ErrorResponse("Narx yoki davomiylik manfiy bo'lmasligi kerak", 400)
      );
    }

    const kurs = await Kurslar.create({
      title,
      description,
      davomiyligi,
      narxi,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Kurs qo'shildi",
      kurs,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const getKurs = async (req, res, next) => {
  try {
    const kurslar = await Kurslar.find()
      .populate("talabalar", "userName tel email")
      .populate("category", "name description");

    if (kurslar.length === 0) {
      return next(new ErrorResponse("Kurslar topilmadi", 404));
    }

    res.status(200).json({
      success: true,
      message: "Kurslar ro'yxati",
      kurslar,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const updateKurs = async (req, res, next) => {
  try {
    const { title, description, davomiyligi, narxi, category } = req.body;
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ErrorResponse("Noto'g'ri yoki mavjud bo'lmagan kurs ID", 400)
      );
    }

    const kurs = await Kurslar.findById(id);
    if (!kurs) {
      return next(new ErrorResponse("Bu ID bo'yicha kurs topilmadi", 404));
    }

    const updatedData = {
      title: title || kurs.title,
      description: description || kurs.description,
      davomiyligi: davomiyligi || kurs.davomiyligi,
      narxi: narxi || kurs.narxi,
      category: category || kurs.category,
    };
    if (updatedData.narxi < 0 || updatedData.davomiyligi < 0) {
      return next(
        new ErrorResponse("Narx yoki davomiylik manfiy bo'lmasligi kerak", 400)
      );
    }

    const newKurs = await Kurslar.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Kurs yangilandi",
      kurs: newKurs,
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

const deleteKurs = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ErrorResponse("Noto'g'ri yoki mavjud bo'lmagan kurs ID", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Kurs muvaffaqiyatli o'chirildi ",
    });
  } catch (error) {
    next(new ErrorResponse(error.message || "Server xatosi", 500));
  }
};

module.exports = { addKurs, getKurs, updateKurs, deleteKurs };
