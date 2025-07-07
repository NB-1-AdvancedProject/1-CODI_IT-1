import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../lib/constants";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userService from "../../services/userService";
import { Request } from "express";
import { VerifyCallback } from "passport-google-oauth20";
import { Profile as PassportProfile } from "passport";

const googleStrategyOptions = {
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/api/auth/google/callback",
  passReqToCallback: true as const, //ture 로 인식을 못해서 강제 인식
};

async function verity(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: PassportProfile & { _json?: any },
  done: VerifyCallback
) {
  const email = profile.emails?.[0]?.value;
  const providerId = profile.id ?? profile._json?.id;

  if (!providerId) {
    return done(new Error("Google 프로필 ID가 없습니다."));
  }
  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    providerId,
    profile.displayName,
    email
  );
  done(null, user);
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verity);

export default googleStrategy;
