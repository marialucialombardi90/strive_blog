import React, { useCallback, useState, useContext, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import draftToHtml from "draftjs-to-html";
import { getPost, newPost, updatePost } from "../../data/fetch";
import { AuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const NewBlogPost = () => {
  const [text, setText] = useState("");
  const [cover, setCover] = useState("");
  const { token } = useContext(AuthContext);
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id);

  const initialFormValue = {
    category: "Science",
    title: "",
    cover: "",
    readTime: {
      value: 0,
      unit: "",
    },
    author: decodedToken.authorId,
    content: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);
  const handleChangeFormValue = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    handleChangeFormValue(event);
    setCover(event.target.files[0]);
  };

  const handleChange = useCallback((value) => {
    setText(draftToHtml(value));
    setFormValue((prevValue) => ({
      ...prevValue,
      content: draftToHtml(value),
    }));
  }, []);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!id) {
      await newPost(formValue, cover);
    } else {
      await updatePost(id, formValue, cover);
    }
    navigate("/");
  };

  useEffect(() => {
    if (id) {
      (async () => {
        const response = await getPost(id);
        if (response) {
          setFormValue((prevValue) => ({
            ...prevValue,
            ...response,
          }));
          setText(response?.content);
        }
      })();
    }
  }, [id]);

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSend}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            value={formValue?.title}
            onChange={(event) => handleChangeFormValue(event)}
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            name="category"
            value={formValue?.category}
            onChange={(event) => handleChangeFormValue(event)}
          >
            <option value="Science">Science</option>
            <option value="Action">Action</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="General">General</option>
            <option value="Fiction">Fiction</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="cover" className="mt-3 mb-3">
          {id ? (
            <Form.Label>
              This is Your uploaded previous file: {formValue?.cover}
            </Form.Label>
          ) : null}
          <Form.Label>Cover</Form.Label>
          <Form.Control type="file" name="cover" onChange={handleChangeImage} />
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Content Blog</Form.Label>
          {!id ? (
            <Editor
              value={text}
              onChange={handleChange}
              className="new-blog-content"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )}
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
