import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";

const BlogAuthor = (props) => {
  const { first_name, last_name, avatar } = props;
  return (
    <Row
      style={{
        alignItems: "center",
      }}
    >
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={avatar} roundedCircle />
      </Col>
      <Col>
        <h6>
          {first_name} {last_name}
        </h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
