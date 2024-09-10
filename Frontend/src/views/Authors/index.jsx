import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { getAuthers } from "../../data/fetch";
import { Link } from "react-router-dom";

const Authors = () => {
  const [authors, setauthers] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await getAuthers();
      setauthers(response.data);
    })();
  }, []);

  return (
    <div className="container mt-5 py-5">
      <div className="row mt-5">
        {authors?.map((item, index) => (
          <div key={index} className="col-xl-3 col-md-4 col-sm-6 mb-4">
            <Link to={`/author/${item._id}/blogs`}>
              <Card className="h-100 shadow mb-5 bg-body rounded">
                <Card.Img
                  variant="top"
                  src={
                    item?.avatar?.length
                      ? item?.avatar
                      : "https://picsum.photos/200"
                  }
                  style={{ objectFit: "cover", height: "280px" }}
                />
                <Card.Body>
                  <Card.Title>
                    {item.first_name} {item.last_name}
                  </Card.Title>
                  <Card.Text>{item.email}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Authors;
