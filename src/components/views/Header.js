import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserRouter, NavLink, Link } from 'react-router-dom'
import * as FiIcons from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import ScoreBoard from "components/views/ScoreBoard";
import { useHistory } from "react-router-dom";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = (props) => {
  const history = useHistory;
  let content = <div></div>;
  if(true){
    content = (
      <BrowserRouter>
      <div className="header">
        <Navbar
          bg="transparent"
          variant="dark"
          sticky="top"
          expand="lg"
          collapseOnSelect
        >
          <Navbar.Brand>Pictionary</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
            {props.currentUser!==null?
              <Nav.Link href="/scoreboard">Score Board</Nav.Link>:
              <Nav.Link href="/startingpage" onClick={()=>alert("register first")}>Score Board</Nav.Link>}
              <Nav.Link href="Change me">Play</Nav.Link>
              <Nav.Link href="Change me">Sign out</Nav.Link>
              <NavDropdown title={<FiIcons.FiSettings color="white" />}>
                <NavDropdown.Item href="Change me">Edit Profile</NavDropdown.Item>
                <NavDropdown.Item href="Change me">Edit whatever</NavDropdown.Item>
                <NavDropdown.Item href="Change me">Sign out </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      </BrowserRouter>
    )
  }
  return (content);
}
  
  


Header.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;