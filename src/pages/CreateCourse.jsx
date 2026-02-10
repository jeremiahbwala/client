import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    category: 'Web Development',
    level: 'Beginner',
    requirements: '',
    learningOutcomes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', {
        ...formData,
        requirements: formData.requirements.split('\n').filter(Boolean),
        learningOutcomes: formData.learningOutcomes.split('\n').filter(Boolean),
        modules: []
      });
      toast.success('Course created successfully!');
      navigate('/instructor/dashboard');
    } catch (error) {
      toast.error('Error creating course');
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header><h4 className="mb-0">Create New Course</h4></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI/ML</option>
                <option value="DevOps">DevOps</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <Form.Control as="textarea" rows={2} required value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Description</Form.Label>
              <Form.Control as="textarea" rows={5} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Requirements (one per line)</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Learning Outcomes (one per line)</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.learningOutcomes} onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary">Create Course</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateCourse;