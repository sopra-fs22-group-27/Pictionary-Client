import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "components/views/Login";
import Register from "components/views/Register"
import Startingpage from "components/views/Startingpage"
import Profile from "components/views/Profile"
import UserList from "components/views/UserList"
import PrivateRoute from "components/views/PrivateRoute"
import EditProfile from "components/views/EditProfile";
// import Drawing from "components/views/Drawing";
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
const AppRouter = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/profile/:token" component={Profile} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        <PrivateRoute exact path="/userlist" component={UserList} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        <PrivateRoute exact path="/scoreboard" component={ScoreBoard} currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>

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
        {/* <Route exact path="/scoreboard" component={ScoreBoard}>
            <ScoreBoard currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
        </Route> */}
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
