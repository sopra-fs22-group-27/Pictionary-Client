import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ScoreBoard.scss";
import { Link } from "react-router-dom";
import { Alert, IconButton, Collapse, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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
  const [anyOperation, setAnyOperation] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const myuser = JSON.parse(localStorage.getItem('user'));

  const back = async () => {
    history.push("/homepage");
  };

  const syncActiveTime = async () => {
    if (anyOperation) {
      try {
        await api.put(`/synctime/${localStorage.getItem("token")}`);
        console.log("sync");
        setAnyOperation(false);
      } catch (error) {
        alert(
          `Something went wrong during fetching the active time: \n${handleError(
            error
          )}`
        );
      }
    }
  }

  const logout = async () => {
    if(!anyOperation){
      try {
        await api.put(`/status/${localStorage.getItem("token")}`);
        localStorage.clear();
        alert("Since you did not do any operation in about 1 min, so you are forced to log out!");
        history.push('/login');
        window.location.reload();
      } catch (error) {
        alert(
          `Something went wrong during updating the logged_out status: \n${handleError(
            error
          )}`
        );
      }
    }
    
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    let timer = setTimeout(() => syncActiveTime(),  1000);
    return () => {
      clearTimeout(timer);
    };
  }, [anyOperation]);

  useEffect(() => {
    let timer = setTimeout(() => logout(),  60000);
    return () => {
      clearTimeout(timer);
    };
  }, [anyOperation]);

  useEffect(() => {
    let timer = setTimeout(() => setAlertOpen(true),  50000);
    return () => {
      clearTimeout(timer);
    };
  }, [anyOperation]);

  useEffect(() => {
    async function fetchMyUser(){
      try{
        const response = await api.get("/users/" + localStorage.getItem('token'));
        const myuser = response.data;
        localStorage.setItem('user', JSON.stringify(myuser));

      } catch (error) {
        console.error(
          `Something went wrong while getting myuser: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while getting myuser. See the console for details."
        );
      }
    }
    fetchMyUser();
  }, [])

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
  const ScoreboardPlayer = ({ user }) => (
    <div className="player-scoreboard container">
      <div className="player-scoreboard username">
        <Link
          className="scoreboard-link"
          to={{ pathname: `/profile/${user.token}`, state: { user: user } }}
        >
          {" "}
          {user.username}{" "}
        </Link>
      </div>
      <div className="player-scoreboard ranking_points">
        {user.ranking_points}
      </div>
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
              to={{
                pathname: `/profile/${myuser.token}`,
                state: { user: myuser },
              }}
            >
              {" "}
              {myuser.username}{" "}
            </Link>
          </div>
          <div className="player-scoreboard ranking_points">
            <div className="scoreboard-Mylink">{myuser.ranking_points}</div>
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
    <div>
      <Collapse in={alertOpen}>
        <Alert
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
                setAnyOperation(true);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          If you are still there, please do some operation. Otherwise, we'll log you out!
        </Alert>
      </Collapse>
      <BaseContainer className="scoreboard container">{content}</BaseContainer>
    </div>
  );
};

export default ScoreBoard;
