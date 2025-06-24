import multer from "multer";
import { RequestHandler } from "express";
import { environment } from "../lib/constants";

const diskUpload = multer({ dest: "uploads/" }).single("file");
const memoryUpload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadMiddleware: RequestHandler = function (req, res, next) {
  if (environment === "development") {
    diskUpload(req, res, function (err) {
      if (err) return next(err);
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
      return res.json({
        message: "이미지 업로드 성공",
        path: req.file.filename,
        key: req.file.originalname,
      });
    });
    return;
  }

  if (environment === "production") {
    memoryUpload(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  }
};
