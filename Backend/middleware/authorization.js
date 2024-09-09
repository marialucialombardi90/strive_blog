import jwt from "jsonwebtoken";
import AuthorR from "../models/authorsSchema.js";

export default (req, res, next) => {
  // check if the utoken is coming
  if (!req.headers.authorization) return res.status(401).send();
  const parts = req.headers.authorization.split(" ");
  if (parts.length != 2) return res.status(401).send();
  if (parts[0] != "Bearer") return res.status(401).send();

  const jwtToken = parts[1];

  // verify the token
  jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, payload) => {
    // if token is expired or invalid
    if (err) return res.status(401).send("token manomesso");

    const author = await AuthorR.findById(payload.authorId); //.select('-password');

    if (!author) return res.status(401).send("autore eliminato");

    req.loggedAuthor = author;
    console.log(author);

    next();
  });
};
