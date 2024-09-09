import Post from "../models/postSchema.js";
import Author from "../models/authorsSchema.js";
import transport from "../services/mailService.js";

export const listPosts = async (req, res) => {
  const page = req.query.page || 1;
  let perPage = req.query.perPage || 12;
  perPage = perPage > 12 ? 10 : perPage;
  try {
    const allPosts = await Post.find(
      req.query.title
        ? { title: { $regex: req.query.title, $options: "i" } }
        : {}
    )
      .collation({ locale: "it" })
      .sort({ title: 1, category: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("author");

    console.log(allPosts);

    const totalResults = await Post.countDocuments();
    const totalPages = Math.ceil(totalResults / perPage);
    res.send({
      data: allPosts,
      page,
      totalPages,
      totalResults,
    });
  } catch (error) {
    console.error(error);

    res.status(404).send({ message: "Not Found" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("author");
    res.send(post);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

export const createPost = async (req, res) => {
  // create a post
  console.log(req.body);
  const coverPath = req.file ? req.file.path : "https://picsum.photos/200";
  const post = new Post({
    ...req.body,
    cover: coverPath,
    readTime: JSON.parse(req.body.readTime),
  });
  let newPost;
  try {
    newPost = await post.save();
    res.send(newPost);
  } catch (error) {
    return res.status(400).send(error);
  }
  try {
    const author = await Author.findById(newPost.author);
    await transport.sendMail({
      from: "noreply@strive.com",
      to: author.email,
      subject: "New Post",
      text: "You have created a new blog post!",
      html: "<b>You have created a new blog post!</b>",
    });
  } catch (error) {
    console.log(error);
  }
};

export const editPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true }); //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (await Post.exists({ _id: id })) {
      await Post.findByIdAndDelete(id);
      res.status(200).send(`ho eliminato il post con id: ${id}`);
    } else {
      res.status(404).send({ message: `ID ${id} not found` });
    }
  } catch (error) {
    res.status(404).send({ message: `ID ${id} not found` });
  }
};

export const updateCover = async (req, res) => {
  const { blogPostId } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      blogPostId,
      { cover: req.file.path },
      { new: true }
    );
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};
