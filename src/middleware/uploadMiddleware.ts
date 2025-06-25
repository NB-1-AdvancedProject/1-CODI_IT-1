import multer from "multer";
import { RequestHandler } from "express";
import { environment } from "../lib/constants";
import EmptyUploadError from "../lib/errors/EmptyUploadError";

const diskUpload = multer({ dest: "uploads/" }).single("file");
const memoryUpload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadMiddleware: RequestHandler = function (req, res, next) {
  if (environment === "development") {
    diskUpload(req, res, function (err) {
      if (err) return next(err);
      if (!req.file) {
        throw new EmptyUploadError();
      }
      return res.json({
        message: "이미지 업로드 성공",
        url: req.file.destination,
        key: req.file.path,
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
