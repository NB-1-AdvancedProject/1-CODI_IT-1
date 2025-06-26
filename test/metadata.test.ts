import app from "../src/app";
import request from "supertest";
import { clearDatabase, disconnectTestDB } from "./testUtil";
import prisma from "../src/lib/prisma";
import { category1, grade1, size1, size2, size3, size4 } from "./metadataDummy";

describe("metadata API 테스트", () => {
  beforeAll(async () => {
    await clearDatabase();
    await prisma.size.create({ data: size1 });
    await prisma.size.create({ data: size2 });
    await prisma.size.create({ data: size3 });
    await prisma.size.create({ data: size4 });
    await prisma.category.create({ data: category1 });
    await prisma.grade.create({ data: grade1 });
  });
  test("metadata Size 기본 조회 테스트", async () => {
    const res = await request(app).get("/api/metadata/size");

    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0].size).toHaveProperty("ko");
    expect(res.body[0].size).toHaveProperty("en");
  });
  test("metadata Category 기본 조회 테스트", async () => {
    const res = await request(app).get("/api/metadata/category/의류");

    expect(res.body[0].name).toBe("의류");
    expect(res.body[0]).toHaveProperty("id");
  });
  test("metadata Grade 기본 조회 테스트", async () => {
    const res = await request(app).get("/api/metadata/grade");

    expect(res.body[0].name).toBe("green");
    expect(res.body[0].id).toBe("grade_green");
    expect(res.body[0].rate).toBe(5);
    expect(res.body[0].minAmount).toBe(100000);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
});
