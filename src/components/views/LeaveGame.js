import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link, BrowserRouter } from "react-router-dom";
import { api, handleError } from "helpers/api";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const removePoints = async() => {
  const gameToken = window.location.pathname.split("/")[2];
  try{ 
    await api.put(`/games/${gameToken}/updateStatus`); //change to finish
  } catch(error) {
    console.error(`Something went wrong while updating game status: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while updating game status! See the console for details.");
  }

  try{ 
    await api.put(`/games/${localStorage.getItem("token")}/points?points=`+ -100); 
  } catch(error) {
    console.error(`Something went wrong while updating game status: \n${handleError(error)}`);
    console.error("Details:", error);
    alert("Something went wrong while updating game status! See the console for details.");
  }
} 

const LeaveGame = (props) => (
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
            onClick={removePoints}
            to={{
              pathname: "/homepage",
              state: { myuser: JSON.parse(localStorage.getItem("user")) },
            }}
          >
            Leave Game (-100p)
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

LeaveGame.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default LeaveGame;
