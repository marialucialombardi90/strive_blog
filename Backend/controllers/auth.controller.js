import Author from "../models/authorsSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transport from "../services/mailService.js";

export const register = async (req, res) => {
  // find the user if exists
  const author = await Author.findOne({ email: req.body.email });
  // if user exists then return
  if (author) return res.status(500).send("Email already exists");
  // create author
  const newAuthor = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    avatar: req.file ? req.file.path : "https://picsum.photos/40",
    verifiedAt: new Date(),
  });

  const authorCreated = await newAuthor.save();

  await transport.sendMail({
    from: "noreply@strive.com",
    to: req.body.email,
    subject: "Welcome",
    text: "Welcome to strive.",
    html: "<b>Welcome new user!</b>",
  });
  res.send(authorCreated);
};

export const login = async (req, res) => {
  // check email then try to login
  const author = await Author.findOne({ email: req.body.email }).select(
    "+password"
  );
  // if password or something is wrong then return
  if (!author) return res.status(401).send("Incorrect Credentials");
  // check password
  if (!(await bcrypt.compare(req.body.password, author.password))) {
    return res.status(401).send("Incorrect Credentials");
  }
  // login with jwt
  jwt.sign(
    { authorId: author.id },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    },
    (err, jwtToken) => {
      if (err) return res.status(500).send();
      return res.send({
        token: jwtToken,
      });
    }
  );
};

export const me = async (req, res) => {
  return res.send(req.loggedAuthor);
};

export const googleCallback = async (req, res) => {
  console.log(req);
  // res.redirect(`http://localhost:3000/login?token=${req.user.token}`)
  // return to front end
  res.redirect(`http://localhost:3000?token=${req.user.jwtToken}`);
};
