import Author from "../models/authorsSchema.js";
import Post from "../models/postSchema.js";

export const getAuthors = async (req, res) => {
  const page = req.query.page || 1;
  let perPage = req.query.perPage || 5;
  perPage = perPage > 10 ? 5 : perPage;
  try {
    const authors = await Author.find({})
      .collation({ locale: "it" })
      .sort({ name: 1, surname: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    const totalResults = await Author.countDocuments();
    const totalPages = Math.ceil(totalResults / perPage);
    res.send({
      data: authors,
      totalResults,
      totalPages,
      page,
    });
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

export const getSingleAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findById(id);
    res.status(200).send(author);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

export const addAuthor = async (req, res) => {
  const author = new Author(req.body);
  author.avatar = author.avatar ? author.avatar : "https://picsum.photos/40";
  try {
    const newAuthor = await author.save();

    res.status(200).send(newAuthor);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const editAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findByIdAndUpdate(id, req.body, { new: true });
    await author.save();
    res.status(200).send(author);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    //se l'id esiste nello schema allora fai la delete
    if (await Author.exists({ _id: id })) {
      await Author.findByIdAndDelete(id);
      res.status(200).send(`ho eliminato l'autore con id: ${id}`);
    } else {
      res.status(404).send({ message: `ID ${id} not found` });
    }
  } catch (error) {
    res.status(404).send({ message: `ID ${id} not found` });
  }
};

export const patchAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const author = await Author.findByIdAndUpdate(
      authorId,
      { avatar: req.file.path },
      { new: true }
    );
    await author.save();
    res.status(200).send(author);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getSingleAuthorPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const authorExists = await Author.findById(id);
    if (!authorExists) {
      return res.status(404).send({ message: "Author not found" });
    }
    const postBySingleAuthor = await Post.find({ author: id });
    res.send(postBySingleAuthor);
  } catch (error) {
    res.status(400).send(error);
  }
};
