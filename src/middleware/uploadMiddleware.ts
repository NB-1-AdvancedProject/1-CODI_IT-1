import multer from "multer";
import { RequestHandler } from "express";
import { environment } from "../lib/constants";
import EmptyUploadError from "../lib/errors/EmptyUploadError";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import uploadService from "../services/uploadService";

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
  if (environment === "development") {
    diskUpload(req, res, function (err) {
      if (err) return next(err);
      next();
    });
    return;
  }

  if (environment === "production") {
    memoryUpload(req, res, async function (err) {
      if (err) return next(err);
      if (!req.file) {
        return next(new EmptyUploadError());
      }
      const { url, key } = await uploadService.uploadImageToS3(req.file);
      (req as any).uploadedImage = { url, key };
      next();
    });
  }
};
