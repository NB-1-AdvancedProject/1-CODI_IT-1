import { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET } from "../../lib/constants";
import { Strategy as KakaoStrategy } from "passport-kakao";
import userService from "../../services/userService";
import { Request } from "express";
import { VerifyCallback } from "passport-google-oauth20";
import { Profile as PassportProfile } from "passport";
import BadRequestError from "../../lib/errors/BadRequestError";

const kakaoStrategyOptions = {
  clientID: KAKAO_CLIENT_ID!,
  clientSecret: KAKAO_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/kakao/callback",
  passReqToCallback: true as const,
};

async function kakaoverity(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: PassportProfile & { _json?: any },
  done: VerifyCallback
) {
  const kakaoName = profile._json.properties?.nickname || "Unknown";
  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    String(profile.id),
    kakaoName
  );
  done(null, user);
}

const kakaoStrategy = new KakaoStrategy(kakaoStrategyOptions, kakaoverity);

export default kakaoStrategy;
