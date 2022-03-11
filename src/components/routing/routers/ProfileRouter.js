import {Redirect, Route} from "react-router-dom";
import Profile from "components/views/Profile";
import PropTypes from 'prop-types';

const ProfileRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of ProfileRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <Profile/>
      </Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

ProfileRouter.propTypes = {
  base: PropTypes.string
}

export default ProfileRouter;
