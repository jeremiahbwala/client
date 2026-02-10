
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
import axios from 'axios';

const Classroom = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], progressPercentage: 0 });

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
      if (response.data.modules[0]?.lessons[0]) {
        setSelectedLesson(response.data.modules[0].lessons[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/api/progress/${id}`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markComplete = async (lessonId) => {
    try {
      const response = await axios.post(`/api/progress/${id}/lessons/${lessonId}`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (!course) {
    return <Container className="py-5 text-center"><div className="spinner-border"></div></Container>;
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              {selectedLesson?.videoUrl ? (
                <div className="ratio ratio-16x9 mb-3">
                  <iframe src={selectedLesson.videoUrl} title={selectedLesson.title} allowFullScreen />
                </div>
              ) : (
                <div className="text-center py-5 bg-light">
                  <FaPlayCircle size={80} className="text-muted mb-3" />
                  <p className="text-muted">Video content will be displayed here</p>
                </div>
              )}
              <h3 className="fw-bold">{selectedLesson?.title}</h3>
              <p>{selectedLesson?.description}</p>
              <div dangerouslySetInnerHTML={{ __html: selectedLesson?.content || '' }} />
              <Button 
                variant="success" 
                onClick={() => markComplete(selectedLesson._id)}
                disabled={progress.completedLessons.includes(selectedLesson?._id)}
              >
                {progress.completedLessons.includes(selectedLesson?._id) ? 'Completed' : 'Mark as Complete'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Course Content</h5>
              <ProgressBar now={progress.progressPercentage} label={`${progress.progressPercentage}%`} className="mt-2" />
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {course.modules.map(module => (
                <div key={module._id}>
                  <ListGroup.Item className="bg-light fw-bold">{module.title}</ListGroup.Item>
                  {module.lessons.map(lesson => (
                    <ListGroup.Item 
                      key={lesson._id}
                      action
                      active={selectedLesson?._id === lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{lesson.title}</span>
                      {progress.completedLessons.includes(lesson._id) && (
                        <FaCheckCircle className="text-success" />
                      )}
                    </ListGroup.Item>
                  ))}
                </div>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Classroom;