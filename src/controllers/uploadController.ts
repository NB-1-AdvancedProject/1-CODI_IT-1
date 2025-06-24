import { RequestHandler } from "express";
import uploadService from "../services/uploadService";

export const postImage: RequestHandler = async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const { url, key } = await uploadService.uploadImageToS3(req.file);
  res.json({ message: "이미지 업로드 성공", url, key });
};
