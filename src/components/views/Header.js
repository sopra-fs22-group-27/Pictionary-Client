import React from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import * as FiIcons from 'react-icons/fi';
// import 'bootstrap/dist/css/bootstrap.css'
/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = props => (
<<<<<<< HEAD
  <div>
  <div>
    <Navbar bg="dark" variant="dark"
        sticky="top" expand="lg" collapseOnSelect>
        <Navbar.Brand>
        {/* <ReactLogo width="40px" height="40px"/> */}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
        <Nav>
          <Nav.Link href="Change me">Score Board</Nav.Link>
          <Nav.Link href="Change me">Play</Nav.Link>
          <Nav.Link href="Change me">Sign out</Nav.Link>
          <NavDropdown title={<FiIcons.FiSettings color="white"/>}>
            <NavDropdown.Item href="Change me">Edit Profile</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Edit whatever</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Sign out </NavDropdown.Item>
          </NavDropdown>

        </Nav>
        </Navbar.Collapse>
      </Navbar>
  </div>
  <div className="header container">
    
    <h1 className="header title">Pictionary</h1>
    {/* <ReactLogo width="60px" height="60px"/> */}
  </div>
=======
  <div className="header container" style={{height: props.height}}>
    <h1 className="header title">Group 27</h1>
    <ReactLogo width="60px" height="60px"/>
>>>>>>> 1b55cd0296f0b863ccf8eba859f756f4b0a40fa8
  </div>
);

Header.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default Header;
