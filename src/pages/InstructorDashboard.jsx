import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { FaPlus, FaBook, FaUsers, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/instructor/my-courses');
      setCourses(response.data);
      const totalStudents = response.data.reduce((acc, c) => acc + c.enrolledStudents.length, 0);
      const totalRevenue = response.data.reduce((acc, c) => acc + (c.enrolledStudents.length * c.price), 0);
      setStats({ totalStudents, totalRevenue });
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col><h1 className="fw-bold">Instructor Dashboard</h1></Col>
        <Col xs="auto">
          <Button as={Link} to="/instructor/create-course" variant="primary">
            <FaPlus className="me-2" /> Create Course
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaBook size={40} className="text-primary mb-2" />
              <h3 className="fw-bold">{courses.length}</h3>
              <p className="text-muted mb-0">Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaUsers size={40} className="text-success mb-2" />
              <h3 className="fw-bold">{stats.totalStudents}</h3>
              <p className="text-muted mb-0">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaDollarSign size={40} className="text-warning mb-2" />
              <h3 className="fw-bold">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header><h5 className="mb-0">My Courses</h5></Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td><strong>{course.title}</strong></td>
                  <td>{course.enrolledStudents.length}</td>
                  <td>${course.price}</td>
                  <td><Badge bg={course.isPublished ? 'success' : 'warning'}>{course.isPublished ? 'Published' : 'Draft'}</Badge></td>
                  <td>
                    <Button variant="outline-primary" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InstructorDashboard;
