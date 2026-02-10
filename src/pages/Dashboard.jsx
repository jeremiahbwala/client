
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaTrophy, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        axios.get('/api/courses/student/enrolled'),
        axios.get('/api/progress')
      ]);
      setEnrolledCourses(coursesRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getProgress = (courseId) => {
    const courseProgress = progress.find(p => p.course._id === courseId || p.course === courseId);
    return courseProgress?.progressPercentage || 0;
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 fw-bold">Welcome back, {user?.name}!</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaBook size={40} className="text-primary mb-2" />
              <h3 className="fw-bold">{enrolledCourses.length}</h3>
              <p className="text-muted mb-0">Enrolled Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaTrophy size={40} className="text-warning mb-2" />
              <h3 className="fw-bold">
                {progress.filter(p => p.progressPercentage === 100).length}
              </h3>
              <p className="text-muted mb-0">Completed Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <FaClock size={40} className="text-success mb-2" />
              <h3 className="fw-bold">
                {progress.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length}
              </h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h3 className="fw-bold mb-3">My Courses</h3>
      {enrolledCourses.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <p className="text-muted">You haven't enrolled in any courses yet</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {enrolledCourses.map(course => (
            <ListGroup.Item key={course._id} className="mb-3 border rounded">
              <Row className="align-items-center">
                <Col md={2}>
                  <img src={course.thumbnail} alt={course.title} className="img-fluid rounded" />
                </Col>
                <Col md={6}>
                  <h5 className="fw-bold mb-2">{course.title}</h5>
                  <p className="text-muted mb-2">
                    Instructor: {course.instructor?.name}
                  </p>
                  <ProgressBar 
                    now={getProgress(course._id)} 
                    label={`${getProgress(course._id)}%`}
                    variant="primary"
                  />
                </Col>
                <Col md={4} className="text-end">
                  <Badge bg={getProgress(course._id) === 100 ? 'success' : 'primary'} className="mb-2">
                    {getProgress(course._id) === 100 ? 'Completed' : 'In Progress'}
                  </Badge>
                  <div>
                    <Link 
                      to={`/classroom/${course._id}`}
                      className="btn btn-primary"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Dashboard;