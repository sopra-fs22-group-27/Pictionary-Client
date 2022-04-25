import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import User from "models/User";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ScoreBoard.scss";
import { Link, useLocation } from "react-router-dom";


// use useEffect to update users, use userLocation to pass paras
const ScoreBoard = (props) => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const location = useLocation();
  const myuser = JSON.parse(localStorage.getItem("user"));
 
  // const myuser = props.currentUser;
  console.log(myuser);
  const back = async () => {
    history.push("/homepage");
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        /*         console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);
        console.log(response); */
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
    props.setCurrentUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  // not sure if I should keep the link in there
const ScoreboardPlayer = ({ user, myuser }) => (
  <div className="player-scoreboard container">
    <div className="player-scoreboard username">
      <Link className="scoreboard-link" to={{pathname: `/profile/${user.token}`,state: { user: user }}}> {user.username} </Link>
    </div>
    <div className="player-scoreboard ranking_points">{user.ranking_points}</div>
  </div>
);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="scoreboard">
      <h2>TOP PLAYERS</h2>

      <div className="player-scoreboard my-container">
          <div className="player-scoreboard username">
            <Link
              className="scoreboard-Mylink"
              to={{pathname: `/profile/${myuser.token}`,state: { user: myuser }}}> 
              {" "}
              {myuser.username}{" "}
            </Link>
          </div>
          <div className="player-scoreboard ranking_points">
            <div className="scoreboard-Mylink">
            {myuser.ranking_points}
            </div>
          </div>
      </div>

        <ul className="scoreboard scoreboard-list">
          {users.map((user) => (
            <ScoreboardPlayer user={user} myuser={myuser} />
          ))}
        </ul>
        <Button width="100%" onClick={() => back()}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="scoreboard container">
      {content}
    </BaseContainer>
  );
};


export default ScoreBoard;