/**
 *
 * PrivateRoutes
 *
 */
import React from "react";
import { Redirect, Route } from "react-router-dom";
import Header from "components/views/Header";

// you should first login, then check profile

const PrivateRoutes = ({
  component: Component,
  currentUser: currentUser,
  setCurrentUser: setCurrentUser,
  ...rest
}) => {
  var session_token = localStorage.getItem("token");

  return (
    <div>
      <Header currentUser={currentUser} height="100%" />
      <Route
        {...rest}
        render={(props) =>
          session_token !== null ? (
            <Component
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ) : (
            (alert("You do not login, please login first!"),
            (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location },
                }}
              />
            ))
          )
        }
      />
    </div>
  );
};

export default PrivateRoutes;
