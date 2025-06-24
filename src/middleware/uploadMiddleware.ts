import multer from "multer";
import { RequestHandler } from "express";
import { environment } from "../lib/constants";

const diskUpload = multer({ dest: "uploads/" }).single("file");
const memoryUpload = multer({ storage: multer.memoryStorage() }).single("file");

export const uploadMiddleware: RequestHandler = function (req, res, next) {
  if (environment === "development") {
    console.log("yes");
    diskUpload(req, res, function (err) {
      if (err) return next(err);
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
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
    console.log("yes2");
    memoryUpload(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  }
};
