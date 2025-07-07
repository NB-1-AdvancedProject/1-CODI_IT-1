import { Request } from "express";
import { Strategy as NaverStrategy } from "passport-naver";
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from "../../lib/constants";
import userService from "../../services/userService";
import { VerifyCallback } from "passport-google-oauth20";
import { Profile as PassportProfile } from "passport";

const naverStrategyOptions = {
  clientID: NAVER_CLIENT_ID!,
  clientSecret: NAVER_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/naver/callback",
  passReqToCallback: true as const,
};

async function naverVerity(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: PassportProfile & { _json?: any },
  done: VerifyCallback
) {
  const email = profile.emails?.[0]?.value;
  const userName = profile?.displayName ?? "Guest";

  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    profile.id,
    userName,
    email
  );
  done(null, user);
}

const naverStrategy = new NaverStrategy(naverStrategyOptions, naverVerity);

export default naverStrategy;
