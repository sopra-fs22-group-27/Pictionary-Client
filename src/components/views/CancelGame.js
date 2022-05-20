import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link, BrowserRouter } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";

const gameToken = window.location.pathname.split("/")[2];

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */


 const deleteGame = async() => {

  const gameToken = window.location.pathname.split("/")[2];


  try {
    await api.delete(`/games/${gameToken}`);
    localStorage.removeItem("createdGame");
  } catch (error) {

    alert(
      `Something went wrong during the game deletion: \n${handleError(error)}`
    );
    localStorage.removeItem("createdGame");
  }
}

const CancelGame = (props) => (
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
        {/* <div>{JSON.parse(localStorage.getItem("user")).username}</div> */}
        <Nav className="ms-auto">
          <Button
            variant="outline-light"
            style={{bg:"blue"}}
            as={Link}
            onClick={deleteGame}
            to={{
              pathname: "/homepage",
              state: { myuser: JSON.parse(localStorage.getItem("user")) },
            }}
          >
            Cancel Game
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

CancelGame.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default CancelGame;
