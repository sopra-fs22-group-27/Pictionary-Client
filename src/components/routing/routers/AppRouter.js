import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "components/views/Login";
import Register from "components/views/Register"
import Startingpage from "components/views/Startingpage"
import Profile from "components/views/Profile"
import UserList from "components/views/UserList"
import PrivateRoute from "components/views/PrivateRoute"
import EditProfile from "components/views/EditProfile";
import HomePage from "components/views/HomePage";
import CreateGame from "components/views/CreateGame";
import Lobby from "components/views/Lobby";
import ScoreBoard from "components/views/ScoreBoard";
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
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/userlist" component={UserList} />
        <PrivateRoute exact path="/scoreboard" component={ScoreBoard} />

        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/startingpage">
          <Startingpage />
        </Route>
        <Route exact path="/">
          <Redirect to="/startingpage" />
        </Route>
        <Route exact path="/editProfile/:id">
          <EditProfile />
        </Route>
        <Route exact path="/home">
          <HomePage/>
        </Route>
        <Route exact path="/create-game">
          <CreateGame/>
        </Route>
        <Route exact path="/lobby/:id">
          <Lobby/>
        </Route>

      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
