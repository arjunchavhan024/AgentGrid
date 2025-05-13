const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only CSV, XLS, and XLSX files are allowed."));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
