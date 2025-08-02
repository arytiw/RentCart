#!/bin/bash

echo "Testing Review Functionality..."
echo "=============================="

# Test Review Service
echo "1. Testing Review Service..."
curl -s http://localhost:9095/reviews/greet || echo "Review Service not responding"

# Test Review Service test endpoint
echo -e "\n2. Testing Review Service test endpoint..."
curl -s http://localhost:9095/reviews/test || echo "Review Service test failed"

# Test Review check endpoint
echo -e "\n3. Testing Review check endpoint..."
curl -s "http://localhost:9095/reviews/check/test-item-123/test-user@example.com" || echo "Review check failed"

echo -e "\n=============================="
echo "Review testing completed!" 