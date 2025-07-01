import { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET } from "../../lib/constants";
import { Strategy as KakaoStrategy } from "passport-kakao";
import userService from "../../services/userService";
import { Request } from "express";
import { VerifyCallback } from "passport-google-oauth20";
import { Profile as PassportProfile } from "passport";

const kakaoStrategyOptions = {
  clientID: KAKAO_CLIENT_ID!,
  clientSecret: KAKAO_CLIENT_SECRET!,
  callbackURL: "/auth/kakao/callback",
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
    profile.id,
    kakaoName
  );
  done(null, user);
}

const kakaoStrategy = new KakaoStrategy(kakaoStrategyOptions, kakaoverity);

export default kakaoStrategy;
