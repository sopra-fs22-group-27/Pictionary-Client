
/**
 *
 * PrivateRoutes
 *
 */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

// you should first login, then check profile

const PrivateRoutes = ({ component: Component, currentUser: currentUser, setCurrentUser: setCurrentUser, ...rest }) => {
  var session_token=localStorage.getItem('token');
  var session_number=localStorage.getItem('number');
  return (
    <Route {...rest} render={props => (
     session_token !== null ? (
      < Component  currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : ( alert("You do not login, please login first!"),
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
              }}
            />
          )
      )}
    />
  )
};


export default PrivateRoutes;