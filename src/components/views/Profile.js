import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import User from "models/User";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { useLocation } from "react-router-dom";

//const Player = ({item}) => (
//
//    <div className="player username">{item}</div>
//
//
//);

//Player.propTypes = {
//  user: PropTypes.object
//};

const Profile = (props) => {
  // use react-router-dom's hook to access the history

  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

  const location = useLocation();
  //console.log(location)
  var { user, myuser } = location.state;
  const myid = myuser.id;

  let content = <Spinner />;

  // var yourDate = new Date(user.birthday);
  // const offset = yourDate.getTimezoneOffset();
  // yourDate = new Date(yourDate.getTime() - (offset*60*1000));

  // var yourDate1 = new Date(user.creation_date);
  // const offset1 = yourDate1.getTimezoneOffset();
  // yourDate1 = new Date(yourDate1.getTime() - (offset1*60*1000));
  // const creation_date = yourDate1.toISOString().split('T')[0];
  //  use userLocation to pass paras, use history.push to redirect
  //logout function
  // const [birthday, setBirthday] = useState(yourDate.toISOString().split('T')[0]);
  const [username, setUsername] = useState(user.username);

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };
  // const changeBirthday = (e) =>{

  //   setBirthday(e.target.value);
  // }
  //update function
  const doUpdate = async () => {
    try {
      const requestBody = JSON.stringify({ username });
      const response = await api.put(`/users/${myid}`, requestBody);
      console.log(response);
      //      const user = new User(response.data);
      alert("update successfully");
      // myuser.birthday = birthday;

      myuser.username = username;

      history.push({
        pathname: `/profile/${myid}`,
        state: { user: myuser, myuser: myuser },
      });
    } catch (error) {
      alert(
        `Something went wrong during updating the profile: \n${handleError(
          error
        )}`
      );
      window.location.reload();
    }
  };

  content = (
    <div className="profile">
      <div>
        {user.id === myid ? (
          <div className="profile field">
            <label className="profile label">User ID</label>
            <input
              type="text"
              className="profile input"
              value={user.id}
              disabled
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="profile field">
        <label className="profile label">User username</label>
        <input
          type="text"
          className="profile input"
          value={username}
          onChange={changeUsername}
          disabled={user.id !== myid}
        />
      </div>

      <div className="profile field">
        <label className="profile label">User email</label>
        <input
          type="text"
          className="profile input"
          value={user.email}
          disabled
        />
      </div>
      <div className="profile field">
        <label className="profile label">User creation_date</label>
        <input
          type="text"
          className="profile input"
          value={user.creation_date}
          disabled
        />
      </div>
      <div className="profile field">
        <label className="profile label">User status</label>
        <input
          type="text"
          className="profile input"
          value={user.status === "ONLINE" ? "ONLINE" : "OFFLINE"}
          disabled
        />
      </div>

      <div className="profile button">
        <Button
          width="100%"
          onClick={() => history.push({ pathname: `/userlist`, state: myuser })}
        >
          Inspect others profile
        </Button>
      </div>
      <div className="profile button">
        {user.id === myid ? (
          <Button width="100%" onClick={() => doUpdate(myid)}>
            Edit my profile
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );

  return (
    //    <Layout content={content} />}
    <BaseContainer className="profile container">
      <h2>{user.username}</h2>

      {content}
    </BaseContainer>
  );
};

export default Profile;
