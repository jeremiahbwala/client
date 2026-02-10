import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Profile updated!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header><h4 className="mb-0">Profile Settings</h4></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control type="url" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary">Update Profile</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;