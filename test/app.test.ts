import request from "supertest";
import app from "../src/app";

test("Express 서버 접속 테스트", async () => {
  const agent = request(app);
  const Response = await agent.get("/health");
  expect(Response.status).toBe(200);
  expect(Response.body.status).toBe("ok");
});
