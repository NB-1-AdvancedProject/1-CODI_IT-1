import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../lib/constants";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userService from "../../services/userService";
import { Request } from "express";

const googleStrategyOptions = {
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true as const,  //ture 로 인식을 못해서 강제 인식
};

async function verity(
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: any
) {
  const user = await userService.oauthCreateOrUpdate(
    profile.provider,
    profile.id,
    profile.displayName
  );
  done(null, user);
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verity);

export default googleStrategy;
