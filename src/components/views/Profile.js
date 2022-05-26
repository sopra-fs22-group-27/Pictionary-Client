import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import { useLocation } from "react-router-dom";
import { Alert, IconButton, Collapse, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const Profile = (props) => {
  // use react-router-dom's hook to access the history

  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

  const location = useLocation();
  const { user } = location.state;
  const username = user.username;
  const [anyOperation, setAnyOperation] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const myuser = JSON.parse(localStorage.getItem("user"));

  const myToken = myuser.token;

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
    if (performance.navigation.type === 1) {
      props.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const doEdit = async () => {
    try {
      history.push({ pathname: `/editProfile/${myToken}` });
    } catch (error) {
      alert(
        `Something went wrong during going to the edit Page: \n${handleError(
          error
        )}`
      );
      window.location.reload();
    }
  };

  content = (
    <div className="profile">
      {/*       <div>
        {user.token === myToken ? (
          <div className="profile field">
            <label className="profile label">User Token</label>
            <input
              type="text"
              className="profile input"
              value={user.token}
              disabled
            />
          </div>
        ) : (
          <div></div>
        )}
      </div> */}
      <div className="profile field">
        <label className="profile label">Username</label>
        <input
          type="text"
          className="profile input"
          value={username}
          //disabled={user.id !== myid}
          disabled
        />
      </div>

      <div className="profile field">
        <label className="profile label">Email</label>
        <input
          type="text"
          className="profile input"
          value={user.email}
          disabled
        />
      </div>
      <div className="profile field">
        <label className="profile label">Creation Date</label>
        <input
          type="text"
          className="profile input"
          value={user.creation_date}
          disabled
        />
      </div>
      <div className="profile field">
        <label className="profile label">Status</label>
        <input
          type="text"
          className="profile input"
          value={user.status === "ONLINE" ? "Online" : "Offline"}
          disabled
        />
      </div>

      <div className="profile button">
        {user.token === myToken ? (
          <Button width="100%" onClick={() => doEdit()}>
            Edit profile
          </Button>
        ) : (
          <div></div>
        )}
      </div>
      <div className="profile button">
        <Button
          width="100%"
          onClick={() =>
            history.push({ pathname: `/scoreboard`, state: myuser })
          }
        >
          Back
        </Button>
      </div>
    </div>
  );

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
      <BaseContainer className="profile container">
        <h2>{user.username}</h2>
        {content}
      </BaseContainer>
    </div>
  );
};

export default Profile;
