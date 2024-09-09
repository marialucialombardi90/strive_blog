import React from "react";
import { Container, Image } from "react-bootstrap";
import BlogAuthor from "./blog-author";

const SingleBlogPost = (props) => {
  const { title, cover, author } = props;

  return (
    <Container>
      <Image className="blog-details-cover" src={cover} fluid />
      <h1 className="blog-details-title">{title}</h1>

      <div className="blog-details-container">
        <div className="blog-details-author">
          <BlogAuthor {...author} />
        </div>
        <div className="blog-details-info">
          <div
            style={{
              marginTop: 20,
            }}
          ></div>
        </div>
      </div>
    </Container>
  );
};

export default SingleBlogPost;
