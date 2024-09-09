import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import Author from "../models/authorsSchema.js";

const googleAuth = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_AUTH_APP_ID,
    clientSecret: process.env.GOOGLE_AUTH_APP_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_APP_CALLBACK,
  },

  async function (accessToken, refreshToken, profile, passportNext) {
    // loging the profile data comming from google auth
    console.log(profile._json);

    // get the required data from the profile of the comming auth user in json format
    const { given_name, family_name, email, sub, picture } = profile._json;
    // find the author from the databse
    let author = await Author.findOne({ googleId: sub });
    // if not fount author then create new author
    if (!author) {
      const newAuthor = new Author({
        googleId: sub,
        first_name: given_name,
        last_name: family_name,
        email,
        avatar: picture,
      });
      author = await newAuthor.save();
    }
    // authenticate the user
    jwt.sign(
      { authorId: author.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
      (err, jwtToken) => {
        if (err) return res.status(500).send();
        return passportNext(null, { jwtToken });
      }
    );
  }
);

export default googleAuth;
