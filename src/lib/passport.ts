import passport from "passport";
import googleStrategy from "../middleware/passport/googleStrategy";
import kakaoStrategy from "../middleware/passport/kakaoStrategy";
import naverStrategy from "../middleware/passport/naverStrategy";

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(naverStrategy);
export default passport;
