import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import User from 'models/User';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserList.scss";
import {Link, useLocation} from "react-router-dom";

const Player = ({user, myuser}) => (
  <div className="player container">
    <div className="player username"><Link className="link" to={{pathname:`/profile/${user.id}`, state: {user: user, myuser: myuser}}}>User {user.username}</Link></div>
    <div className="player id">User id: {user.id}</div>
  </div>
);

// use useEffect to update users, use userLocation to pass paras
const UserList = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const location = useLocation();
  const myuser = location.state;
  console.log(myuser)
  const myid = myuser.id;
//  alert(myid);

//  alert("my id is " + myid);
  const logout = async () => {
    if(users != null){
	    try{
	          const status = "OFFLINE";
//	          alert(logged_in);
	          const requestBody = JSON.stringify({status});
	          const response = await api.put(`/status/${myid}`, requestBody);
	          console.log(response);
	          const user = new User(response.data);
//	          alert("update logged_in status successfully");
	          localStorage.removeItem('token');

	          const number = localStorage.getItem('number');
              localStorage.setItem('number', number - 1);

	          history.push('/login');
	        } catch(error){
	          alert(`Something went wrong during updating the logged_in status: \n${handleError(error)}`);
	        }
	 }else{
	    history.push('/login');
	 }


  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users');

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();

  }, []);

  let content = <Spinner/>;

  if (users) {
    content = (
      <div className="userlist">
        <ul className="userlist user-list">
          {users.map(user => (
            <Player user={user} myuser={myuser} key={user.id}/>
          ))}
        </ul>
        <Button
          width="100%"
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="userlist container">
      <h2>Happy Coding!</h2>
      <p className="userlist paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
}

export default UserList;
