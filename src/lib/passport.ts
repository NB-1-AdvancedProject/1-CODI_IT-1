import passport from "passport";
import googleStrategy from "../middleware/passport/googleStrategy";
import kakaoStrategy from "../middleware/passport/kakaoStrategy";

passport.use(googleStrategy);
passport.use(kakaoStrategy);
export default passport;
