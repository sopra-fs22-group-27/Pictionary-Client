import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "components/views/Login";
import Register from "components/views/Register"
import Startingpage from "components/views/Startingpage"
import Profile from "components/views/Profile"
import PrivateRoute from "components/views/PrivateRoute"
import EditProfile from "components/views/EditProfile";
import ScoreBoard from "components/views/ScoreBoard";
import Header from "components/views/Header";
import CreateGame from "components/views/CreateGame";
import HomePage from "components/views/HomePage";
import Lobby from "components/views/Lobby";
import Game from "components/views/Game"
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/profile".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /profile renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */

 //PrivateRoute
const AppRouter = (props) => {
  return (
    <BrowserRouter>
      <Header currentUser={props.currentUser} height="100%" />
      <Switch>
        <PrivateRoute exact path="/profile/:token" component={Profile} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        <PrivateRoute exact path="/creategame" component={CreateGame} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        <PrivateRoute exact path="/homepage" component={HomePage} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        {/* <Route exact path="/scoreboard" component={ScoreBoard}/> */}

        <Route exact path="/login">
          <Login currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route>
        <Route exact path="/register">
          <Register currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route>
        <Route exact path="/startingpage">
          <Startingpage />
        </Route>
        <Route exact path="/">
          <Redirect to="/startingpage" />
        </Route>
        <Route exact path="/editProfile/:token" component={EditProfile} >
          <EditProfile currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route>
        <Route exact path="/scoreboard">
          <ScoreBoard currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route>
        <Route exact path="/lobby/:token">
          <Lobby/>
        </Route>
        <Route exact path="/game/:token">
            <Game/>
        </Route>

        {/* <Route exact path="/homepage">
          <HomePage currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route> */}

      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
