import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { getAutherPosts } from "../../data/fetch";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../../components/blog/BligItem";

const AuthorBlogs = () => {
  const [posts, setPosts] = useState([]);

  const { id } = useParams();
  const [aggiornaBlogList, setAggiornaBlogList] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await getAutherPosts(id);
      setPosts(response);
    })();
  }, []);

  return (
    <div className="container mt-5 py-5">
      <Row className="py-5">
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
                isSubBlog={true}
                setAggiornaBlogList={setAggiornaBlogList}
                aggiornaBlogList={aggiornaBlogList}
              />
            </Col>
          ))
        ) : (
          <div>No Data To Show</div>
        )}
      </Row>
    </div>
  );
};

export default AuthorBlogs;
