import multer from "multer";
import { RequestHandler } from "express";
import { environment } from "../lib/constants";
import EmptyUploadError from "../lib/errors/EmptyUploadError";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = uuidv4();
    cb(null, baseName + ext);
  },
});

const diskUpload = multer({ storage }).single("image");
const memoryUpload = multer({ storage: multer.memoryStorage() }).single(
  "image"
);

export const uploadMiddleware: RequestHandler = function (req, res, next) {
  const isMultipart = req.headers["content-type"]?.includes(
    "multipart/form-data"
  );

  if (!isMultipart) {
    return next();
  }

  const handleUpload =
    environment === "development" ? diskUpload : memoryUpload;

  handleUpload(req, res, function (err) {
    if (err) return next(err);
    next();
  });
};
