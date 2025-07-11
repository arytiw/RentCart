import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import reviewService from '../services/reviewService';

const ReviewTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    userId: '',
    comment: '',
    rating: 5
  });
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await reviewService.testConnection();
      setConnectionStatus(response);
      setMessage({ type: 'success', text: 'Successfully connected to Review Service!' });
    } catch (error) {
      setConnectionStatus('Connection failed');
      setMessage({ type: 'danger', text: `Connection failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data
    const validation = reviewService.validateReviewData(formData);
    if (!validation.isValid) {
      setMessage({ type: 'danger', text: validation.errors.join(', ') });
      setLoading(false);
      return;
    }

    try {
      const newReview = await reviewService.addReview(formData);
      setMessage({ type: 'success', text: 'Review added successfully!' });
      setFormData({ itemId: '', userId: '', comment: '', rating: 5 });
      
      // Refresh reviews if we're viewing all reviews
      if (reviews.length > 0) {
        loadAllReviews();
      }
    } catch (error) {
      setMessage({ type: 'danger', text: `Error adding review: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const loadAllReviews = async () => {
    setLoading(true);
    try {
      const allReviews = await reviewService.getAllReviews();
      setReviews(allReviews);
      setMessage({ type: 'success', text: `Loaded ${allReviews.length} reviews` });
    } catch (error) {
      setMessage({ type: 'danger', text: `Error loading reviews: ${error.message}` });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const searchReviewsByItem = async () => {
    if (!searchId.trim()) {
      setMessage({ type: 'warning', text: 'Please enter an Item ID' });
      return;
    }
    
    setLoading(true);
    try {
      const itemReviews = await reviewService.getReviewsByItemId(searchId);
      setReviews(itemReviews);
      setMessage({ type: 'success', text: `Found ${itemReviews.length} reviews for item ${searchId}` });
    } catch (error) {
      setMessage({ type: 'danger', text: `Error searching reviews: ${error.message}` });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const searchReviewsByUser = async () => {
    if (!searchId.trim()) {
      setMessage({ type: 'warning', text: 'Please enter a User ID' });
      return;
    }
    
    setLoading(true);
    try {
      const userReviews = await reviewService.getReviewsByUserId(searchId);
      setReviews(userReviews);
      setMessage({ type: 'success', text: `Found ${userReviews.length} reviews by user ${searchId}` });
    } catch (error) {
      setMessage({ type: 'danger', text: `Error searching reviews: ${error.message}` });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoading(true);
    try {
      await reviewService.deleteReview(reviewId);
      setMessage({ type: 'success', text: 'Review deleted successfully!' });
      
      // Remove from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      setMessage({ type: 'danger', text: `Error deleting review: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Review Service Test Interface</h1>
          
          {/* Connection Status */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Connection Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                {loading && <Spinner animation="border" size="sm" className="me-2" />}
                <Badge bg={connectionStatus.includes('Hello') ? 'success' : 'danger'}>
                  {connectionStatus || 'Testing...'}
                </Badge>
                <Button variant="outline-primary" size="sm" className="ms-2" onClick={testConnection}>
                  Test Connection
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Messages */}
          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
              {message.text}
            </Alert>
          )}

          {/* Add Review Form */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Add New Review</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddReview}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Item ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemId"
                        value={formData.itemId}
                        onChange={handleInputChange}
                        placeholder="Enter item ID"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>User ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        placeholder="Enter user ID"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Write your review..."
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Review'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Search and Load Reviews */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Load & Search Reviews</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Button variant="info" onClick={loadAllReviews} disabled={loading}>
                    Load All Reviews
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Item ID or User ID"
                  />
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-primary" 
                    className="me-2" 
                    onClick={searchReviewsByItem}
                    disabled={loading}
                  >
                    By Item
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={searchReviewsByUser}
                    disabled={loading}
                  >
                    By User
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Reviews Display */}
          {reviews.length > 0 && (
            <Card>
              <Card.Header>
                <h5>Reviews ({reviews.length})</h5>
              </Card.Header>
              <Card.Body>
                {reviews.map((review, index) => (
                  <Card key={review.id || index} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={8}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <Badge bg="primary" className="me-2">Item: {review.itemId}</Badge>
                              <Badge bg="secondary">User: {review.userId}</Badge>
                            </div>
                            <div className="text-warning fs-5">
                              {renderStars(review.rating)} ({review.rating})
                            </div>
                          </div>
                          <p className="mb-2">{review.comment}</p>
                          <small className="text-muted">
                            {reviewService.formatDate(review.timestamp)}
                          </small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => deleteReview(review.id)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewTest;
