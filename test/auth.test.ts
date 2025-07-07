import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { clearDatabase, getAuthenticatedReq } from "./testUtil";
import authService from "../src/services/authService";
import { connectRedis, getRedisClient } from "../src/lib/redis";
import { User } from "../src/types/user";
import nock from "nock";
import {
  GOOGLE_CLIENT_ID,
  KAKAO_CLIENT_ID,
  NAVER_CLIENT_ID,
} from "../src/lib/constants";

const GOOGLE_AUTH_URL = "https://accounts.google.com";
const GOOGLE_URL = "https://www.googleapis.com";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";

const KAKAO_URL = "https://kauth.kakao.com";
const KAKAO_USERINFO_URL = "https://kapi.kakao.com";
const KAKAO_REDIRECT_URI = "http://localhost:3000/api/auth/kakao/callback";

const NAVER_URL = "https://nid.naver.com";
const NAVER_USERINFO_URL = "https://openapi.naver.com";
const NAVER_REDIRECT_URI = "http://localhost:3000/api/auth/naver/callback";

describe("로그인 테스트", () => {
  const password = "Password@1234";
  const passwordHashed = bcrypt.hashSync(password, 10);
  let redis: ReturnType<typeof getRedisClient>;

  beforeEach(async () => {
    await clearDatabase();
    await connectRedis();
  });

  afterEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST/api/auth/login", () => {
    test("로그인", async () => {
      const email = "test1@test.com";
      const name = "김이박";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          name,
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("test1@test.com");
    });

    test("비밀번호 미일치", async () => {
      const email = "test2@test.com";
      const name = "김이박";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          name,
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test2@test.com", password: "안녕하세여!!1234" });
      expect(response.status).toBe(403);
    });
  });
  test("회원탈퇴시 로그인 안됨", async () => {
    const email = "test3@test.com";
    const name = "김이박";
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHashed,
        name,
        deletedAt: new Date(),
      },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email, password });
    expect(response.status).toBe(404);
  });

  describe("GET/api/auth/google - OAuth 시작", () => {
    test("Google 인증 페이지로 리다이렉트", async () => {
      const response = await request(app).get("/api/auth/google");

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain(
        GOOGLE_AUTH_URL + "/o/oauth2/v2/auth"
      );
      expect(response.headers.location).toContain(
        `client_id=${GOOGLE_CLIENT_ID}`
      );
      expect(response.headers.location).toContain(
        `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`
      );
      expect(response.headers.location).toContain("response_type=code");
    });
  });

  describe("GET /api/auth/google/callback - OAuth 콜백 처리", () => {
    const mockAuthCode = "mock_auth_code_from_google";
    const mockAccessToken = "mock_google_access_token";
    const mockRefreshToken = "mock_google_refresh_token";
    const mockGoogleProfile = {
      id: "google_user_123",
      email: "test@gmail.com",
      verified_email: true,
      name: "U ser",
      given_name: "U",
      family_name: "ser",
    };
    test("Google: 신규 회원 등록 + 토큰 발행", async () => {
      nock(GOOGLE_URL).post("/oauth2/v4/token", /.*/).reply(200, {
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        expires_in: 3600,
        token_type: "Bearer",
        scope: "email profile",
      });

      nock(GOOGLE_URL)
        .get("/oauth2/v3/userinfo")
        .query({ access_token: mockAccessToken })
        .reply(200, mockGoogleProfile);

      const response = await request(app).get(
        `/api/auth/google/callback?code=${mockAuthCode}`
      );

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user.email).toBe("test@gmail.com");

      const newUser = await prisma.user.findUnique({
        where: { email: mockGoogleProfile.email },
      });

      expect(newUser).toBeDefined();
      expect(newUser?.name).toBe(mockGoogleProfile.name);
      expect(newUser?.provider).toBe("google");
      expect(newUser?.providerId).toBe(mockGoogleProfile.id);
    });
  });

  describe("GET/api/auth/kakao - KAKAO", () => {
    test("kakao 인증 페이지로 리다이렉트", async () => {
      const response = await request(app).get("/api/auth/kakao");

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain(
        KAKAO_URL + "/oauth/authorize"
      );
      expect(response.headers.location).toContain(
        `client_id=${KAKAO_CLIENT_ID}`
      );
      expect(response.headers.location).toContain(
        `redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`
      );
      expect(response.headers.location).toContain("response_type=code");
    });
  });

  describe("GET /api/auth/kakao/callback - OAuth 콜백 처리", () => {
    const mockAuthCode = "mock_auth_code_from_kakao";
    const mockAccessToken = "mock_kakao_access_token";
    const mockRefreshToken = "mock_kakao_refresh_token";
    const mockKakaoProfile = {
      id: "kakao_user_123",
      properties: {
        nickname: "testuser",
      },
      kakao_account: {
        email: "test@kakao.com",
        profile: {
          nickname: "testuser",
        },
      },
    };
    test("Kakao: 신규 회원 등록 + 토큰 발행", async () => {
      nock(KAKAO_URL).post("/oauth/token").reply(200, {
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        expires_in: 3600,
        token_type: "Bearer",
        scope: "profile_nickname",
      });

      nock(KAKAO_USERINFO_URL)
        .get("/v2/user/me")
        .query({ access_token: mockAccessToken })
        .reply(200, mockKakaoProfile);

      const response = await request(app).get(
        `/api/auth/kakao/callback?code=${mockAuthCode}`
      );

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      const newUser = await prisma.user.findUnique({
        where: { id: response.body.user.id },
      });

      expect(newUser).toBeDefined();
      expect(newUser?.name).toBe(
        mockKakaoProfile.kakao_account.profile.nickname
      );
      expect(newUser?.provider).toBe("kakao");
      expect(newUser?.providerId).toBe(mockKakaoProfile.id);
    });
  });

  describe("GET/api/auth/naver - Naver", () => {
    test("Naver 인증 페이지로 리다이렉트", async () => {
      const response = await request(app).get("/api/auth/naver");

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain(
        NAVER_URL + "/oauth2.0/authorize"
      );
      expect(response.headers.location).toContain(
        `client_id=${NAVER_CLIENT_ID}`
      );
      expect(response.headers.location).toContain(
        `redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}`
      );
      expect(response.headers.location).toContain("response_type=code");
    });
  });

  describe("GET /api/auth/naver/callback - OAuth 콜백 처리", () => {
    const mockAuthCode = "mock_auth_code_from_naver";
    const mockAccessToken = "mock_naver_access_token";
    const mockRefreshToken = "mock_naver_refresh_token";
    const mockNaverProfile = {
      id: "naver_user_123",
      email: "test@naver.com",
      verified_email: true,
      nickname: "test1",
    };
    test("NAVER: 신규 회원 등록 + 토큰 발행", async () => {
      nock(NAVER_URL).post("/oauth2.0/token").reply(200, {
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        expires_in: 3600,
        token_type: "Bearer",
        scope: "profile_name",
      });

      nock(NAVER_USERINFO_URL, {
        reqheaders: {
          authorization: `Bearer ${mockAccessToken}`,
        },
      })
        .get("/v1/nid/me")
        .reply(200, {
          resultcode: "00",
          message: "success",
          response: mockNaverProfile,
        });

      const response = await request(app).get(
        `/api/auth/naver/callback?code=${mockAuthCode}`
      );

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      const newUser = await prisma.user.findUnique({
        where: { id: response.body.user.id },
      });

      expect(newUser).toBeDefined();
      expect(newUser?.name).toBe(mockNaverProfile.nickname);
      expect(newUser?.provider).toBe("naver");
      expect(newUser?.providerId).toBe(mockNaverProfile.id);
    });
  });

  describe("POST/api/auth/logout", () => {
    test("로그아웃", async () => {
      const email = "test4@test.com";
      const name = "김갑수";
      const logoutUser = await prisma.user.create({
        data: { email, password: passwordHashed, name },
      });

      const authReq = getAuthenticatedReq(logoutUser.id);
      const response = await authReq.post("/api/auth/logout").send({});
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/auth/refresh", () => {
    let redis: ReturnType<typeof getRedisClient>;
    let createUser: User;
    let initialRefreshToken: string;

    beforeAll(async () => {
      await clearDatabase();
      redis = await connectRedis();
    });

    beforeEach(async () => {
      await redis?.flushAll();

      createUser = await prisma.user.create({
        data: {
          email: "test5@test.com",
          name: "김말자",
          password: passwordHashed,
          type: "BUYER",
        },
      });

      initialRefreshToken = await authService.createToken(
        createUser,
        "refresh"
      );

      await authService.saveToken(createUser.id, initialRefreshToken);
    });

    afterEach(async () => {
      await prisma.user.delete({ where: { id: createUser.id } });
      await redis?.flushAll();
    });

    afterAll(async () => {
      await prisma.$disconnect();
      if (redis && redis.isReady) {
        await redis.quit();
      }
    });

    test("리프레시 토큰 정상 재발행", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: initialRefreshToken })
        .expect(200);
    });

    test("리프레시 토큰 없으면 에러", async () => {
      const response = await request(app).post("/api/auth/refresh").send({});

      expect(response.status).toBe(400);
    });
  });
});
