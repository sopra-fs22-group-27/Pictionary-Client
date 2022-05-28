import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link, BrowserRouter } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */


 const deleteGame = async(gameToken, createdGame, userToken) => {

  if (gameToken === createdGame) {
    try {
      await api.delete(`/games/${gameToken}`);
      localStorage.removeItem("createdGame");
    } catch (error) {
  
      alert(
        `Something went wrong during the lobby deletion: \n${handleError(error)}`
      );
      localStorage.removeItem("createdGame");
    }
  } else {
    try {
      await api.put(`/games/${gameToken}/leave/${userToken}`);
    } catch (error) {
      alert(
        `Something went wrong during the lobby leaving: \n${handleError(error)}`
      );

    }
  }

  
}

const CancelGame = (props) => { 
  const [gameToken, setGameToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const [createdGame, setCreatedGame] = useState('');

  useEffect(() => {
    setGameToken(window.location.pathname.split("/")[2]);
    setCreatedGame(localStorage.getItem("createdGame"));
    setUserToken(localStorage.getItem("token"));
  }, [])

  return (
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
              onClick={() => deleteGame(gameToken, createdGame, userToken)}
              to={{
                pathname: "/homepage",
                state: { myuser: JSON.parse(localStorage.getItem("user")) },
              }}
            >
              {createdGame === gameToken? "Cancel Game": "Leave Game"}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

CancelGame.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default CancelGame;
