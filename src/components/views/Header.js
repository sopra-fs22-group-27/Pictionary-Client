import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

import { api, handleError } from "helpers/api";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const logout = async (props) => {
  if (props.currentUser != null) {
    try {
      await api.put(`/status/${localStorage.getItem("token")}`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      alert(
        `Something went wrong during updating the logged_out status: \n${handleError(
          error
        )}`
      );
    }
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};

const Header = (props) => (
  <div className="header">
    <Navbar
      bg="transparent"
      variant="dark"
      sticky="top"
      expand="lg"
      collapseOnSelect
    >
      {props.currentUser ? (
        <Navbar.Brand
          as={Link}
          to={{
            pathname: "/homepage",
            state: { myuser: JSON.parse(localStorage.getItem("user")) },
          }}
        >
          Pictionary
        </Navbar.Brand>
      ) : (
        <Navbar.Brand as={Link} to={{ pathname: "/startingpage" }}>
          Pictionary
        </Navbar.Brand>
      )}

      <Navbar.Toggle />
      <Navbar.Collapse>
        {/* <div>{JSON.parse(localStorage.getItem("user")).username}</div> */}
        <Nav className="ms-auto">
          {props.currentUser ? (
            <Nav.Link
              as={Link}
              to={{
                pathname: "/homepage",
                state: { myuser: JSON.parse(localStorage.getItem("user")) },
              }}
            >
              Home
            </Nav.Link>
          ) : (
            <Nav.Link href="/startingpage">Home</Nav.Link>
          )}

          {props.currentUser ? (
            <Nav.Link href="/scoreboard">Scoreboard</Nav.Link>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
          {props.currentUser ? (
            <Nav.Link as={Link} to={{pathname:"/login"}} onClick={() => logout(props)}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link href="/register">Register</Nav.Link>
          )}

          {/* <Nav.Link href="Change me">Play</Nav.Link>
          <Nav.Link href="Change me">Sign out</Nav.Link> */}

          {/*           <NavDropdown title={<FiIcons.FiSettings color="white" />}>
            <NavDropdown.Item href="Change me">Edit Profile</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Edit whatever</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Sign out </NavDropdown.Item>
          </NavDropdown>
           */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

Header.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;
