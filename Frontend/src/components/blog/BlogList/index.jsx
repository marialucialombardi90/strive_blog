import { Col, Row, Form } from "react-bootstrap";
import BlogItem from "../BligItem";
import { loadPosts } from "../../../data/fetch";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";

const BlogList = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [aggiornaBlogList, setAggiornaBlogList] = useState(false);

  const handleSearch = (event) => {
    setSearch(event.target.value ? event.target.value : "");
  };
  useEffect(() => {
    loadPosts(search).then((data) => setPosts(data.data));
  }, [search, aggiornaBlogList]);
  return (
    <>
      {token && (
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search post"
            className="me-2 mb-2 w-25"
            aria-label="Search"
            name="search"
            onChange={handleSearch}
          />
        </Form>
      )}
      <Row>
        {posts.length ? (
          posts.map((post, i) => (
            <Col
              key={`item-${i}`}
              md={4}
              style={{
                marginBottom: 50,
              }}
            >
              <BlogItem
                key={post.title}
                {...post}
                setAggiornaBlogList={setAggiornaBlogList}
                aggiornaBlogList={aggiornaBlogList}
              />
            </Col>
          ))
        ) : (
          <div>No Data To Show</div>
        )}
      </Row>
    </>
  );
};

export default BlogList;
