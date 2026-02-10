import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Badge, Button } from 'react-bootstrap';
import { FaStar, FaUsers, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filters, courses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    setFilteredCourses(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 fw-bold">Explore Courses</h1>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label><FaSearch /> Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Design">Design</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <Form.Select name="level" value={filters.level} onChange={handleFilterChange}>
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Courses Grid */}
      <Row className="g-4">
        {filteredCourses.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <h4>No courses found</h4>
                <p className="text-muted">Try adjusting your filters</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredCourses.map(course => (
            <Col key={course._id} md={6} lg={4}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Img 
                  variant="top" 
                  src={course.thumbnail} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg="primary" className="me-2">{course.category}</Badge>
                    <Badge bg="secondary">{course.level}</Badge>
                  </div>
                  <Card.Title className="fw-bold">{course.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {course.shortDescription}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <FaStar className="text-warning me-1" />
                      <span>{course.rating.average.toFixed(1)}</span>
                      <span className="text-muted ms-1">({course.rating.count})</span>
                    </div>
                    <div className="text-muted">
                      <FaUsers className="me-1" />
                      {course.enrolledStudents.length} students
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-primary mb-0">${course.price}</h4>
                    <Button as={Link} to={`/courses/${course._id}`} variant="primary">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Courses;