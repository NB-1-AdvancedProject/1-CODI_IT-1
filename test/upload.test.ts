import "aws-sdk-client-mock-jest";
import { mockClient } from "aws-sdk-client-mock";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import prisma from "../src/lib/prisma";
import { User } from "@prisma/client";
import { sellerUser } from "./productDummy";
import bcrypt from "bcrypt";
import { s3Client } from "../src/lib/s3Client";
import { uploadMiddleware } from "../src/middleware/uploadMiddleware";

//multer 업로드 부분 mock 구현 설정
jest.mock("../src/middleware/uploadMiddleware", () => ({
  uploadMiddleware: jest.fn(),
}));

const s3Mock = mockClient(s3Client);

describe("파일 업로드 테스트", () => {
  let sellerUser1: User;

  beforeAll(async () => {
    await clearDatabase();
    sellerUser1 = await prisma.user.create({
      data: {
        ...sellerUser,
        password: await bcrypt.hash(sellerUser.password, 10),
      },
    });
  });

  beforeEach(() => {
    s3Mock.reset();
    s3Mock.on(PutObjectCommand).resolves({ ETag: '"abc123"', VersionId: "1" });
  });

  test("파일 업로드 기본 동작 흐름 테스트", async () => {
    //multer 업로드 부분 mock 구현 설정
    (uploadMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
      req.file = {
        originalname: "test.jpg",
        mimetype: "image/jpeg",
        buffer: Buffer.from("fake image"),
      };
      next();
    });

    const authReq = getAuthenticatedReq(sellerUser1.id);
    const response = await authReq.post("/api/s3/upload");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("이미지 업로드 성공");
    expect(response.body.url).toContain("uploads/");
    expect(response.body.key).toMatch(/^uploads\/\d+_test\.jpg$/);

    expect(s3Mock).toHaveReceivedCommand(PutObjectCommand);
    expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
      ContentType: "image/jpeg",
      Key: expect.stringMatching(/^uploads\/\d+_test\.jpg$/),
    });
  });

  test("파일이 없을 경우", async () => {
    // uploadMiddleware mock 내 req.file을 일부러 undefined로 만들어보기
    (uploadMiddleware as jest.Mock).mockImplementationOnce(
      (req: any, res: any, next: any) => {
        req.file = undefined;
        next();
      }
    );

    const authReq = getAuthenticatedReq(sellerUser1.id);
    const response = await authReq.post("/api/s3/upload");

    expect(response.status).toBe(400);
    expect(response.text).toBe("No file uploaded.");
    expect(s3Mock).not.toHaveReceivedAnyCommand();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });
});
