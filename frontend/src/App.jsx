import { useState } from 'react';
import './App.css'
import Home from './pages/Home.jsx';
import ReviewTest from './components/ReviewTest';

import { Container, Button, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';

function App(){
  return(
    <>
      <Home></Home>
      <ReviewTest></ReviewTest>
    </>
  );
}
export default App;
