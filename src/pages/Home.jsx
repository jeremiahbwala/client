import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaCode, FaUsers, FaGraduationCap, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient text-white py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6}>
              <h1 className="display-3 fw-bold mb-4">
                Forge Your Tech Future
              </h1>
              <p className="lead mb-4">
                Master cutting-edge technologies with expert-led bootcamps. 
                Join a vibrant community of learners and build your dream career in tech.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/courses" variant="light" size="lg" className="px-4">
                  Explore Courses
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg" className="px-4">
                  Get Started Free
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="text-center">
                <FaRocket size={300} className="text-white opacity-75" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5 fw-bold">Why Choose DevForge?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaGraduationCap size={60} className="text-primary mb-3" />
                <h4>Expert Instructors</h4>
                <p className="text-muted">
                  Learn from industry professionals with years of real-world experience
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaUsers size={60} className="text-primary mb-3" />
                <h4>Active Community</h4>
                <p className="text-muted">
                  Connect with peers, share projects, and get help when you need it
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <FaCode size={60} className="text-primary mb-3" />
                <h4>Hands-On Projects</h4>
                <p className="text-muted">
                  Build real applications and create an impressive portfolio
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-3">Ready to Start Learning?</h2>
              <p className="lead text-muted mb-0">
                Join thousands of students already building their tech careers
              </p>
            </Col>
            <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
              <Button as={Link} to="/register" variant="primary" size="lg" className="px-5">
                Join Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-5">
        <Row className="text-center">
          <Col md={3}>
            <h2 className="display-4 fw-bold text-primary">500+</h2>
            <p className="text-muted">Active Students</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-primary">50+</h2>
            <p className="text-muted">Expert Instructors</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-primary">100+</h2>
            <p className="text-muted">Courses</p>
          </Col>
          <Col md={3}>
            <h2 className="display-4 fw-bold text-primary">95%</h2>
            <p className="text-muted">Success Rate</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;