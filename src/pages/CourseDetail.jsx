import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, ListGroup, Alert } from 'react-bootstrap';
import { FaStar, FaUsers, FaClock, FaBook, FaCheckCircle } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('your_stripe_publishable_key');

const CheckoutForm = ({ courseId, price, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const { data } = await axios.post('/api/payments/create-intent', { courseId });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Confirm enrollment
        await axios.post('/api/payments/confirm', {
          paymentIntentId: result.paymentIntent.id,
          courseId
        });
        
        toast.success('Enrollment successful!');
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title className="mb-3">Payment Details</Card.Title>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' }
                }
              }
            }}
          />
        </Card.Body>
      </Card>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button 
        type="submit" 
        variant="primary" 
        className="w-100" 
        disabled={!stripe || loading}
        size="lg"
      >
        {loading ? 'Processing...' : `Pay $${price}`}
      </Button>
    </form>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
      
      if (user) {
        setIsEnrolled(user.enrolledCourses?.some(c => c._id === id || c === id));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleEnrollmentSuccess = () => {
    setShowCheckout(false);
    setIsEnrolled(true);
    navigate(`/classroom/${id}`);
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

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="img-fluid rounded mb-4"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
          
          <h1 className="fw-bold mb-3">{course.title}</h1>
          
          <div className="d-flex align-items-center mb-4">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="rounded-circle me-2"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <div>
              <div className="fw-bold">{course.instructor.name}</div>
              <small className="text-muted">Instructor</small>
            </div>
          </div>

          <div className="mb-4">
            <Badge bg="primary" className="me-2">{course.category}</Badge>
            <Badge bg="secondary" className="me-2">{course.level}</Badge>
            <span className="me-3">
              <FaStar className="text-warning me-1" />
              {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
            </span>
            <span>
              <FaUsers className="me-1" />
              {course.enrolledStudents.length} students
            </span>
          </div>

          <Tabs defaultActiveKey="overview" className="mb-4">
            <Tab eventKey="overview" title="Overview">
              <Card className="border-0">
                <Card.Body>
                  <h4 className="fw-bold mb-3">About This Course</h4>
                  <p>{course.description}</p>

                  <h5 className="fw-bold mt-4 mb-3">What You'll Learn</h5>
                  <ListGroup variant="flush">
                    {course.learningOutcomes.map((outcome, index) => (
                      <ListGroup.Item key={index} className="border-0 px-0">
                        <FaCheckCircle className="text-success me-2" />
                        {outcome}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <h5 className="fw-bold mt-4 mb-3">Requirements</h5>
                  <ul>
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="curriculum" title="Curriculum">
              <Card className="border-0">
                <Card.Body>
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module._id} className="mb-4">
                      <h5 className="fw-bold">
                        Module {module.order}: {module.title}
                      </h5>
                      <p className="text-muted">{module.description}</p>
                      <ListGroup>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <ListGroup.Item key={lesson._id}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <FaBook className="me-2 text-primary" />
                                {lesson.title}
                              </div>
                              <div className="text-muted">
                                <FaClock className="me-1" />
                                {lesson.duration} min
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="reviews" title="Reviews">
              <Card className="border-0">
                <Card.Body>
                  {course.reviews.length === 0 ? (
                    <p className="text-muted">No reviews yet</p>
                  ) : (
                    course.reviews.map(review => (
                      <div key={review._id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex align-items-center mb-2">
                          <img 
                            src={review.user.avatar} 
                            alt={review.user.name}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <div>
                            <div className="fw-bold">{review.user.name}</div>
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={i < review.rating ? 'text-warning' : 'text-muted'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        <Col lg={4}>
          <Card className="shadow-lg sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h2 className="text-primary fw-bold mb-3">${course.price}</h2>
              
              {isEnrolled ? (
                <Button 
                  as={Link} 
                  to={`/classroom/${course._id}`}
                  variant="success" 
                  size="lg" 
                  className="w-100"
                >
                  Go to Classroom
                </Button>
              ) : showCheckout ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    courseId={course._id} 
                    price={course.price}
                    onSuccess={handleEnrollmentSuccess}
                  />
                </Elements>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
              )}

              <hr />

              <h6 className="fw-bold mb-3">This course includes:</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 px-0">
                  <FaBook className="me-2" />
                  {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <FaClock className="me-2" />
                  Lifetime access
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <FaCheckCircle className="me-2 text-success" />
                  Certificate of completion
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;