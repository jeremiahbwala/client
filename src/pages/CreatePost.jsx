import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Discussion',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/community', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      toast.success('Post created!');
      navigate('/community');
    } catch (error) {
      toast.error('Error creating post');
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header><h4 className="mb-0">Create New Post</h4></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <option value="Discussion">Discussion</option>
                <option value="Question">Question</option>
                <option value="Showcase">Showcase</option>
                <option value="Help">Help</option>
                <option value="Tutorial">Tutorial</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={10} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control type="text" placeholder="javascript, react, node" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary">Create Post</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePost;