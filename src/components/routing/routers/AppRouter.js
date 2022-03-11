import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {ProfileGuard} from "components/routing/routeProtectors/ProfileGuard";
import ProfileRouter from "components/routing/routers/ProfileRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register"
import Home from "components/views/Home"
import Profile from "components/views/Profile"
import UserList from "components/views/UserList"
import PrivateRoute from "components/views/PrivateRoute"
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
		<PrivateRoute exact path="/userlist" component={UserList} />}

        <Route exact path="/login">

            <Login/>

        </Route>
        <Route exact path="/register">
            <Register/>
        </Route>
        <Route exact path="/home">
            <Home/>
        </Route>
        <Route exact path="/">
          <Redirect to="/home"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
