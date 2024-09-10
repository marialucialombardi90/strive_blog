import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/BlogList";
import "./styles.css";
import { AuthContext } from "../../context/AuthContextProvider";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { login } from "../../data/fetch";
import { Link, useSearchParams } from "react-router-dom";
import { errorToast, successToast } from "../../components/Toasts";
import { serverConfig } from "../../utils";

const Home = () => {
  let [searchParams] = useSearchParams();
  const { token, setToken } = useContext(AuthContext);
  useEffect(() => {
    if (searchParams.get("token")) {
      localStorage.setItem("token", searchParams.get("token"));
      setToken(searchParams.get("token"));
    }
  }, [searchParams, setToken]);
  const [formValue, setFormValue] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const tokenObj = await login(formValue);
      if (tokenObj && tokenObj.token) {
        localStorage.setItem("token", tokenObj.token);
        setToken(tokenObj.token);
        successToast("Login Success");
      } else {
        errorToast("Login Failed!");
      }
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  };

  return (
    <Container fluid="sm">
      <h1
        className="blog-main-title mb-3"
        style={token ? {} : { textAlign: "center" }}
      >
        Welcome to Strive Blog!
      </h1>

      {token ? (
        <BlogList />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            margin: "30px 0",
          }}
        >
          <div
            style={{
              padding: 30,
              borderRadius: "8px",
              boxShadow: "2px 2px 4px 1px rgba(222, 222, 222, 1)",
            }}
          >
            <Form style={{ maxWidth: "400px", minWidth: "325px" }}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="your password"
                />
              </Form.Group>
              <Button
                variant="primary"
                style={{ width: "100%" }}
                onClick={handleLogin}
              >
                Login Now
              </Button>
            </Form>
            <p style={{ textAlign: "center" }}>
              <b>or</b>
            </p>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              as={Link}
              to={`${serverConfig.base_url}/auth/google`}
            >
              Login with Google
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;

