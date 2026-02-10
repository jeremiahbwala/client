import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBook, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

const Navigation = () => {
  const { user, isAuthenticated, logout, isInstructor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span className="text-primary">Dev</span>Forge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/courses">
              <FaBook className="me-1" /> Courses
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/community">
                <FaUsers className="me-1" /> Community
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-light" size="sm">Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Nav.Link>
              </>
            ) : (
              <NavDropdown 
                title={
                  <span>
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="rounded-circle me-2"
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                    {user.name}
                  </span>
                } 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  <FaUser className="me-2" /> Dashboard
                </NavDropdown.Item>
                {isInstructor && (
                  <NavDropdown.Item as={Link} to="/instructor/dashboard">
                    <FaChalkboardTeacher className="me-2" /> Instructor Dashboard
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to="/profile">
                  Profile Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;