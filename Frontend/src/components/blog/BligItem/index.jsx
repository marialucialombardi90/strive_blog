import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BlogAuthor from "../BlogAuthor";
import "./styles.css";
import { AuthContext } from "../../../context/AuthContextProvider";
import { deletePost } from "../../../data/fetch";
import { errorToast, successToast } from "../../Toasts";

const BlogItem = (props) => {
  const { authorInfo } = useContext(AuthContext);
  const {
    title,
    cover,
    author,
    _id,
    setAggiornaBlogList,
    aggiornaBlogList,
    content,
    isSubBlog,
  } = props;
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await deletePost(_id);
      successToast("Post deleted!");
      setAggiornaBlogList(!aggiornaBlogList);
    } catch (error) {
      console.error(error);
      errorToast("Unable to delete the post");
    }
  };

  return (
    <Card className="blog-card">
      <Link to={`/blog/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover" />
        <Card.Body>
          <Card.Title className="blog-title">{title}</Card.Title>
          {!isSubBlog ? (
            <>
              <hr />
              <BlogAuthor {...author} />
              <hr />
            </>
          ) : null}
          <Card.Text
            className="blog-desc"
            dangerouslySetInnerHTML={{ __html: content }}
          ></Card.Text>
        </Card.Body>
      </Link>
      <Card.Footer>
        <Button variant="dark" as={Link} to={`/blog/${_id}`}>
          Read
        </Button>
        {!isSubBlog && authorInfo._id === author._id ? (
          <>
            <Button
              variant="primary"
              className="ms-2"
              onClick={() => {
                navigate(`/edit/blog/${_id}`);
              }}
            >
              Edit
            </Button>
            <Button variant="danger" className="ms-2" onClick={handleDelete}>
              Delete
            </Button>
          </>
        ) : (
          ""
        )}
      </Card.Footer>
    </Card>
  );
};

export default BlogItem;
