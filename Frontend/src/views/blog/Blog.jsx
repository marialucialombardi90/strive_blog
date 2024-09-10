import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Container,
  Image,
  Col,
  Row,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/BlogAuthor";
import "./styles.css";
import {
  loadSinglePost,
  loadComments,
  newComment,
  deleteComment,
  updateComment,
} from "../../data/fetch";
import { AuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from "jwt-decode";
import { FiTrash2 } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";

const Blog = () => {
  const { token, authorInfo } = useContext(AuthContext);
  const decodedToken = jwtDecode(token);
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [editOrDelete, setEditOrDelete] = useState(null);
  const { id } = params;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialFormState = {
    content: "",
    post: id,
    author: decodedToken.authorId,
  };

  const [formValue, setFormValue] = useState(initialFormState);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSaveComment = async (e) => {
    e.preventDefault();
    if (editOrDelete?.open !== "edit") {
      try {
        await newComment(id, formValue);
        const commentsRes = await loadComments(id);
        setComments(commentsRes.data);
        setFormValue(initialFormState);
        handleClose();
      } catch (error) {
        console.error("Errore durante il salvataggio del commento:", error);
      }
    } else {
      try {
        await updateComment(id, formValue, editOrDelete?.id);
        const commentsRes = await loadComments(id);
        setComments(commentsRes.data);
        setFormValue(initialFormState);
        setEditOrDelete(null);
      } catch (error) {
        console.error("Errore durante il salvataggio del commento:", error);
      }
    }
  };

  useEffect(() => {
    const blogPostDetails = async () => {
      try {
        const res = await loadSinglePost(id);
        const commentsRes = await loadComments(id);
        if (res) {
          setBlog(res);
          setComments(commentsRes.data);
          setLoading(false);
        } else {
          console.log("non ho trovato");
          navigate("/404");
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    blogPostDetails();
  }, [params, navigate, id]);

  const handleDeleteModal = useCallback(async () => {
    try {
      setLoading(true);

      const res = await deleteComment(id, editOrDelete.id);
      if (res) {
        const commentsRes = await loadComments(id);
        setComments(commentsRes.data);
        setLoading(false);
      } else {
        console.log("non ho trovato");
        navigate("/404");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setEditOrDelete(null);
    }
  }, [editOrDelete, id, navigate]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>
          <div className="mt-5">Post comments:</div>
          <Row>
            {comments.map((comment, i) => (
              <Col
                key={`item-${i}`}
                md={8}
                className="mb-3"
                style={{
                  marginBottom: 20,
                }}
              >
                {editOrDelete &&
                editOrDelete?.open === "edit" &&
                editOrDelete?.id === comment._id ? (
                  <Row>
                    <Form
                      onSubmit={handleSaveComment}
                      style={{
                        display: "flex",
                        gap: 50,
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <Form.Control
                        size="sm"
                        placeholder="Max 100 characters"
                        name="content"
                        value={formValue.content}
                        onChange={handleChange}
                      />
                      <div style={{ display: "flex", gap: 15 }}>
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={() => {
                            setEditOrDelete(null);
                          }}
                        >
                          <FiX />
                        </button>
                        <button
                          type="submit"
                          style={{ background: "none", border: "none" }}
                        >
                          <FiCheck />
                        </button>
                      </div>
                    </Form>
                  </Row>
                ) : (
                  <Row className="mt-2 px-2 border rounded bg-light">
                    <Col md={8}>{comment.content}</Col>
                    {authorInfo._id === comment.author._id ? (
                      <Col md={4} style={{ display: "flex", gap: 15 }}>
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={() => {
                            setEditOrDelete({
                              open: "edit",
                              id: comment._id,
                            });
                            setFormValue({
                              ...formValue,
                              content: comment.content,
                            });
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          style={{ background: "none", border: "none" }}
                          onClick={() => {
                            setEditOrDelete({
                              open: "delete",
                              id: comment._id,
                            });
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </Col>
                    ) : null}
                  </Row>
                )}
                <div className="mt-2 px-2 ">{comment.author.first_name}</div>
              </Col>
            ))}
          </Row>
          {show ? (
            <Form
              onSubmit={handleSaveComment}
              style={{
                display: "flex",
                gap: 50,
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Form.Control
                size="sm"
                placeholder="Max 100 characters"
                name="content"
                value={formValue.content}
                onChange={handleChange}
              />
              <Button variant="primary" onClick={handleSaveComment}>
                Save Changes
              </Button>
            </Form>
          ) : null}

          <Button variant="primary" onClick={handleShow}>
            Add Comment
          </Button>
          {editOrDelete?.open === "delete" ? (
            <Modal show={true} onHide={() => setEditOrDelete(null)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete comment</Modal.Title>
                Do you want to delete this comment?
              </Modal.Header>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setEditOrDelete(null)}
                >
                  No
                </Button>
                <Button variant="primary" onClick={handleDeleteModal}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          ) : null}
        </Container>
      </div>
    );
  }
};

export default Blog;
