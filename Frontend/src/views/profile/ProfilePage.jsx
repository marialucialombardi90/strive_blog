import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContextProvider";
import { updateUserAvatar } from "../../data/fetch";

const ProfilePage = () => {
  const { authorInfo } = useContext(AuthContext);

  // Initial user profile state
  const initialProfile = {
    first_name: "John Doe",
    last_name: "John Doe",
    email: "johndoe@example.com",
    date_of_birth: "22-2-20000",
    avatar: "https://via.placeholder.com/150",
  };

  const [userProfile, setUserProfile] = useState(initialProfile); // User profile data
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [updateAvatar, setUdateAvatar] = useState(false); // Edit mode toggle
  const [updatedProfile, setUpdatedProfile] = useState(initialProfile); // Temp storage for editing
  const [avatar, setAvatar] = useState(null); // Temp storage for editing

  // Toggle between view and edit mode
  const saveChanges = async () => {
    setUserProfile(updatedProfile);
    try {
      await updateUserAvatar(authorInfo._id, avatar);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };
  const toggleEditMode = () => {
    if (updateAvatar) {
      saveChanges();
    }
    setUdateAvatar(!updateAvatar);
    setUpdatedProfile(userProfile); // Reset the editable state when toggling
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "avatar") {
      setAvatar(e.target.files[0]);
    } else {
      setUpdatedProfile({
        ...updatedProfile,
        [name]: value,
      });
    }
  };

  // Save changes to user profile

  useEffect(() => {
    if (authorInfo) {
      (() => {
        setUserProfile(authorInfo);
      })();
    }
  }, [authorInfo]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={userProfile.avatar}
              alt="Profile Pic"
            />
            <Card.Body className="text-center">
              {isEditing || updateAvatar ? (
                <Form.Group controlId="formProfilePic">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="file"
                    name="avatar"
                    // value={updatedProfile.avatar}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              ) : (
                <>
                  <Card.Title>{userProfile.name}</Card.Title>
                  <Card.Text>{userProfile.bio}</Card.Text>
                </>
              )}
              <Button
                variant="primary"
                className="mt-3"
                onClick={toggleEditMode}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h4>Personal Details</h4>
              <hr />
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label>First Name</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={updatedProfile.first_name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>
                          <strong>{userProfile.first_name}</strong>
                        </p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Last Name</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={updatedProfile.last_name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>{userProfile.last_name}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Email</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={updatedProfile.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>{userProfile.email}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formAddress">
                      <Form.Label>DOB</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="date"
                          name="date_of_birth"
                          value={updatedProfile.date_of_birth}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p>{userProfile.date_of_birth}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {isEditing && (
                  <Button
                    variant="success"
                    className="mt-3"
                    onClick={saveChanges}
                  >
                    Save Changes
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
