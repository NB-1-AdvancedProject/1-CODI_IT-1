import passport from "passport";
import googleStrategy from "../middleware/passport/googleStrategy";

passport.use(googleStrategy);
export default passport;
