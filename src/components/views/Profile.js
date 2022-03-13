import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import User from 'models/User';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import {useLocation} from 'react-router-dom';

//const Player = ({item}) => (
//
//    <div className="player username">{item}</div>
//
//
//);

//Player.propTypes = {
//  user: PropTypes.object
//};

const Profile = props => {
  // use react-router-dom's hook to access the history

  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

  const location = useLocation();
  var {user, myuser} = location.state;
  const myid = myuser.id;

  const logout = async () => {

	try{
		const logged_in = !(myuser.logged_in);

		const requestBody = JSON.stringify({logged_in});
		const response = await api.put(`/status/${myid}`, requestBody);
		console.log(response);
//		const user = new User(response.data);
//		alert("update logged_in status successfully");
		localStorage.removeItem('token');

		const number = localStorage.getItem('number');
		localStorage.setItem('number', number - 1);

//		alert("removed");
		history.push('/login');
		} catch(error){
			alert(`Something went wrong during updating the logged_in status: \n${handleError(error)}`);
		}

  }
  let content = <Spinner/>;

  var yourDate = new Date(user.birthday);
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - (offset*60*1000));

  var yourDate1 = new Date(user.creation_date);
  const offset1 = yourDate1.getTimezoneOffset();
  yourDate1 = new Date(yourDate1.getTime() - (offset1*60*1000));
  const creation_date = yourDate1.toISOString().split('T')[0];
//  use userLocation to pass paras, use history.push to redirect
  //logout function
  const [birthday, setBirthday] = useState(yourDate.toISOString().split('T')[0]);
  const [username, setUsername] = useState(user.username);

  const changeUsername = (e) =>{
    setUsername(e.target.value);
  }
  const changeBirthday = (e) =>{

    setBirthday(e.target.value);
  }
  //update function
  const doUpdate = async () =>{
    try{
      const requestBody = JSON.stringify({birthday, username});
      const response = await api.put(`/users/${myid}`, requestBody);
      console.log(response);
//      const user = new User(response.data);
      alert("update successfully");
      myuser.birthday = birthday;

      myuser.username = username;

      history.push({pathname:`/profile/${myid}`, state: {user: myuser, myuser: myuser}});
    } catch(error){
      alert(`Something went wrong during updating the profile: \n${handleError(error)}`);
      window.location.reload();
    }
  }

  content = (
	<div className="profile">
	<div className="profile field">
		<div className="profile paragraph"><span>Welcome User {myid}:</span><span>You are inspecting User {user.id} Profile</span></div>
	</div>
	<div>
		{user.id === myid?<div className="profile field">
			<label className="profile label">User ID</label>
			<input type="text" className="profile input" value={user.id} disabled/>
			</div>:<div></div>}
	</div>
	<div className="profile field">
				<label className="profile label">User username</label>
				<input type="text" className="profile input" value={username} onChange={changeUsername} disabled={user.id !== myid} />
	</div>

	<div className="profile field">
				<label className="profile label">User birthday</label>
				<input type="date" className="profile input" value={birthday} onChange={changeBirthday} disabled={user.id !== myid}/>
	</div>
	<div className="profile field">
						<label className="profile label">User creation_date</label>
						<input type="text" className="profile input" value={creation_date.replaceAll("-", "/")} disabled/>
	</div>
	<div className="profile field">
		<label className="profile label">User logged_in</label>
		<input type="text" className="profile input" value={user.logged_in===true?'true':'false'} disabled/>
	</div>

	<div className="profile button"><Button width="100%" onClick={() => logout()}>Logout</Button></div>
	<div className="profile button"><Button width="100%" onClick={() => history.push({pathname: `/userlist`, state:myuser})}>Inspect others profile</Button></div>
	<div className="profile button">{user.id === myid?<Button width="100%" onClick={() => doUpdate(myid)}>Edit my profile</Button>:<div></div>}</div>

    </div>
  );

  const Layout = props => { return (
    <BaseContainer className="profile container">
          <h2>Happy Coding!</h2>
          <p className="profile paragraph">
            (user != null)?`Get user {user.username} from secure endpoint`: Get user {myid} from secure endpoint
          </p>
          {props.content}
    </BaseContainer>
  )}


  return (
//    <Layout content={content} />}
   <BaseContainer className="profile container">
          <h2>Happy Coding!</h2>
          <p className="profile paragraph">
            Get user {user.id} from secure endpoint:

          </p>
          {content}
    </BaseContainer>
  );
}

export default Profile;
