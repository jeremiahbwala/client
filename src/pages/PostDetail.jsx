import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Form, Badge } from 'react-bootstrap';
import { FaHeart, FaComment } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/community/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/community/${id}/like`);
      fetchPost();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/community/${id}/comments`, { content: comment });
      setComment('');
      toast.success('Comment added!');
      fetchPost();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!post) return <Container className="py-5 text-center"><div className="spinner-border"></div></Container>;

  return (
    <Container className="py-5">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <img src={post.author.avatar} alt={post.author.name} className="rounded-circle me-3" style={{ width: '50px', height: '50px' }} />
            <div>
              <h6 className="mb-0 fw-bold">{post.author.name}</h6>
              <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          </div>
          <h2 className="fw-bold mb-3">{post.title}</h2>
          <Badge bg="primary" className="mb-3">{post.category}</Badge>
          <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <Button variant="outline-danger" onClick={handleLike}>
            <FaHeart /> {post.likes.length}
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header><FaComment /> Comments ({post.comments.length})</Card.Header>
        <Card.Body>
          <Form onSubmit={handleComment} className="mb-4">
            <Form.Group>
              <Form.Control as="textarea" rows={3} placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">Post Comment</Button>
          </Form>
          {post.comments.map(c => (
            <div key={c._id} className="mb-3 pb-3 border-bottom">
              <div className="d-flex align-items-center mb-2">
                <img src={c.user.avatar} alt={c.user.name} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                <div>
                  <div className="fw-bold">{c.user.name}</div>
                  <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
              <p className="mb-0">{c.content}</p>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;