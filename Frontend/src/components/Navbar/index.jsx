import React from "react";
import {
  Button,
  Container,
  Navbar,
  Modal,
  Form,
  Image,
  NavDropdown,
  Spinner,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";
import { AuthContext } from "../../context/AuthContextProvider";
import { useContext, useState } from "react";
import { register } from "../../data/fetch";
import { FiPlus } from "react-icons/fi";


const NavBar = () => {
  const { token, setToken, authorInfo, setAuthorInfo } =
    useContext(AuthContext);
  const navigate = useNavigate();
  console.log(authorInfo);
  const [showReg, setShowReg] = useState(false);
  const handleCloseReg = () => setShowReg(false);
  const handleShowReg = () => setShowReg(true);
  const [loading, setLoading] = useState(false);


  const initialRegistrationFormValue = {
    first_name: "",
    last_name: "",
    avatar: "",
    password: "",
    email: "",
    date_of_birth: "",
  };
  const [regFormValue, setRegFormValue] = useState(
    initialRegistrationFormValue
  );
  const [avatar, setAvatar] = useState("");


  const handleChangeRegistration = (event) => {
    setRegFormValue({
      ...regFormValue,
      [event.target.name]: event.target.value,
    });
  };


  const handleChangeImage = (event) => {
    setAvatar(event.target.files[0]);
  };


  const handleRegister = async () => {
    setLoading(true);
    const res = await register(regFormValue, avatar);
    console.log(res);
    handleCloseReg();
    setRegFormValue(initialRegistrationFormValue);
    setLoading(false);
  };


  const handleLogout = () => {
    setToken(null);
    setAuthorInfo(null);
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>


        <Modal
          size="lg"
          show={showReg}
          onHide={!loading ? handleCloseReg : () => { }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>REGISTER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput3"
              >
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={regFormValue.email}
                  onChange={handleChangeRegistration}
                  placeholder="name@example.com"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput4"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={regFormValue.password}
                  onChange={handleChangeRegistration}
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput5"
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={regFormValue.first_name}
                  onChange={handleChangeRegistration}
                  placeholder="First Name"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput6"
              >
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={regFormValue.last_name}
                  onChange={handleChangeRegistration}
                  placeholder="Last Name"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput6"
              >
                <Form.Label>DOB</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={regFormValue.date_of_birth}
                  onChange={handleChangeRegistration}
                  placeholder="Date of birth"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput7"
              >
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="file"
                  name="avatar"
                  onChange={handleChangeImage}
                  placeholder="Select Avatar"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseReg}
              disabled={loading}
            >
              Close
            </Button>


            <Button
              variant="primary"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Register now
            </Button>
          </Modal.Footer>
        </Modal>


        {authorInfo && token ? (
          <>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">


              <Nav className="me-auto">
                <Nav.Link as={Link} to="/authors" style={{ textDecoration: "none" }}>
                  Authors
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  Logout
                </Nav.Link>
                <Nav.Link>


                  <Button
                    as={Link}
                    to="/new"
                    className="blog-navbar-add-button"
                    variant="outline-dark"
                  >
                    <FiPlus size={25} />
                    New Blog
                  </Button>
                </Nav.Link>


              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <Button
            className="ms-3"
            variant="secondary"
            onClick={handleShowReg}
          >
            Register
          </Button>
        )}
      </Container>
    </Navbar>
  );
};


export default NavBar;



