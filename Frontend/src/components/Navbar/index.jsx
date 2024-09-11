import React, { useState, useContext } from "react";
import {
  Button,
  Container,
  Navbar,
  Modal,
  Form,
  Image,
  Spinner,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";
import { AuthContext } from "../../context/AuthContextProvider";
import { FiPlus } from "react-icons/fi";

const NavBar = () => {
  const { token, setToken, authorInfo, setAuthorInfo } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [showReg, setShowReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); // Add this state to control navbar collapse

  const initialRegistrationFormValue = {
    first_name: "",
    last_name: "",
    avatar: "",
    password: "",
    email: "",
    date_of_birth: "",
  };
  const [regFormValue, setRegFormValue] = useState(initialRegistrationFormValue);
  const [avatar, setAvatar] = useState("");

  const handleCloseReg = () => setShowReg(false);
  const handleShowReg = () => setShowReg(true);

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

  const handleNavItemClick = (path) => {
    setExpanded(false); // Collapse the navbar when a nav item is clicked
    navigate(path);
  };

  return (
    <Navbar
      expand="lg"
      className="blog-navbar"
      fixed="top"
      expanded={expanded} // Control expanded state
    >
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/" onClick={() => handleNavItemClick("/")}>
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Modal
          size="lg"
          show={showReg}
          onHide={!loading ? handleCloseReg : () => {}}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>REGISTER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Your form content */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReg} disabled={loading}>
              Close
            </Button>
            <Button variant="primary" onClick={handleRegister} disabled={loading}>
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
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              onClick={() => setExpanded(!expanded)} // Toggle expanded state
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => handleNavItemClick("/authors")}>
                  Authors
                </Nav.Link>
                <Nav.Link onClick={() => handleNavItemClick("/profile")}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                <Nav.Link>
                  <Button
                    as={Link}
                    to="/new"
                    className="blog-navbar-add-button"
                    variant="outline-dark"
                    onClick={() => handleNavItemClick("/new")}
                  >
                    <FiPlus size={25} />
                    New Blog
                  </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <Button className="ms-3" variant="secondary" onClick={handleShowReg}>
            Register
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
