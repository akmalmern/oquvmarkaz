const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_DIR || "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.]/g, "-")
      .toLowerCase();
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    const error = new multer.MulterError(
      "INVALID_FILE_TYPE",
      "Faqat JPEG, PNG yoki WEBP formatidagi rasmlar qabul qilinadi."
    );
    cb(error);
  }
};

// Multer konfiguratsiyasi
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
    files: 1,
  },
  fileFilter: fileFilter,
});

// Xatolik uchun middleware (fayl ixtiyoriy)
const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(
          new ErrorResponse("Fayl hajmi 3 MB dan oshmasligi kerak.", 400)
        );
      }
      if (err.code === "INVALID_FILE_TYPE") {
        return next(new ErrorResponse(err.message, 400));
      }
      return next(
        new ErrorResponse(`Fayl yuklashda xatolik: ${err.message}`, 500)
      );
    }
    // Agar fayl bo‘lmasa, xatolik qaytarmaymiz, davom etamiz
    next();
  });
};

module.exports = uploadMiddleware;
