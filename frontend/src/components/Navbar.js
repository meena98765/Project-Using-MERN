import React from "react"
import { Navbar, Nav } from 'react-bootstrap';

function NavBar () {
  return (
    <Navbar bg="primary" variant="dark">
    <Navbar.Brand href="#home">Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#features">Log in</Nav.Link>
      <Nav.Link href="#pricing">Register</Nav.Link>
    </Nav>
  </Navbar>
  )
}

export default NavBar
