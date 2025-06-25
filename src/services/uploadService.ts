import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/s3Client";

async function uploadImageToS3(file: Express.Multer.File) {
  const { originalname, buffer } = file;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}_${originalname}`,
    Body: buffer,
    ContentType: file?.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
  return { url: fileUrl, key: params.Key };
}

async function deleteFileFromS3(key: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}

export default {
  uploadImageToS3,
  deleteFileFromS3,
};
