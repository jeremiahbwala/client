import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaHeart, FaComment, FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [filters, posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/community');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    setFilteredPosts(filtered);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Community</h1>
          <p className="text-muted">Connect, share, and learn together</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/community/create" variant="primary">
            <FaPlus className="me-2" /> New Post
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <Form.Select 
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Discussion">Discussion</option>
            <option value="Question">Question</option>
            <option value="Showcase">Showcase</option>
            <option value="Help">Help</option>
            <option value="Tutorial">Tutorial</option>
          </Form.Select>
        </Col>
      </Row>

      {filteredPosts.map(post => (
        <Card key={post._id} className="mb-3 shadow-sm hover-card">
          <Card.Body>
            <Row>
              <Col md={10}>
                <div className="d-flex align-items-center mb-2">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="rounded-circle me-2"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <div>
                    <div className="fw-bold">{post.author.name}</div>
                    <small className="text-muted">
                      <Badge bg="info" className="me-2">{post.author.role}</Badge>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <Link to={`/community/${post._id}`} className="text-decoration-none text-dark">
                  <h5 className="fw-bold mb-2">{post.title}</h5>
                </Link>
                <Badge bg="primary" className="me-2">{post.category}</Badge>
                {post.tags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-1">{tag}</Badge>
                ))}
                <p className="text-muted mt-2 mb-0">
                  {post.content.substring(0, 150)}...
                </p>
              </Col>
              <Col md={2} className="text-center">
                <div className="mb-2">
                  <FaHeart className="text-danger me-1" />
                  {post.likes.length}
                </div>
                <div className="mb-2">
                  <FaComment className="text-primary me-1" />
                  {post.comments.length}
                </div>
                <div>
                  <FaEye className="text-muted me-1" />
                  {post.views}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Community;