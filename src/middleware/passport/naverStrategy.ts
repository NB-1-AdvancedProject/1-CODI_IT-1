import { Request } from "express";
import { Strategy as NaverStrategy } from "passport-naver";
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from "../../lib/constants";
import userService from "../../services/userService";
import { VerifyCallback } from "passport-google-oauth20";
import { Profile as PassportProfile } from "passport";

const naverStrategyOptions = {
  clientID: NAVER_CLIENT_ID!,
  clientSecret: NAVER_CLIENT_SECRET!,
  callbackURL: "/auth/naver/callback",
  passReqToCallback: true as const,
};

async function naverVerity(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: PassportProfile & { _json?: any },
  done: VerifyCallback
) {
  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    profile.id,
    profile.displayName
  );
  done(null, user);
}

const naverStrategy = new NaverStrategy(naverStrategyOptions, naverVerity);

export default naverStrategy;
