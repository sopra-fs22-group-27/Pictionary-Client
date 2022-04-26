import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { useLocation } from "react-router-dom";
import validator from "validator";
import "styles/views/EditProfile.scss";

const FormField1 = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        type="text"
        className="register input"
        placeholder="Enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

const FormField2 = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        type="password"
        className="register input"
        placeholder="Enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

const EditProfile = (props) => {
  const history = useHistory();
  const myuser = JSON.parse(localStorage.getItem("user"));
  let [username, setUsername] = useState(null);
  let [password, setPassword] = useState(null);
  const [emailError, setEmailError] = useState("");
  let [email, setEmail] = useState(null);

  const emailValidator =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const validateEmail = (e) => {
    setEmail(e.target.value);
    if (email.match(emailValidator)) {
      setEmailError("Valid Email");
    } else {
      setEmailError("Invalid Email");
    }
  };

  useEffect(() => {
    if (performance.navigation.type === 1) {
      props.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const back = () => {
    history.push({
      pathname: `/profile/${myuser.token}`,
      state: { user: myuser },
    });
  };

  const edit = async () => {
    try {
      if (email == null) {
        email = myuser.email;
      }
      if (username == null) {
        username = myuser.username;
      }
      if (password == null) {
        password = myuser.password;
      }
      const requestBody = JSON.stringify({ username, password, email });
      console.log(requestBody);
      const response = await api.put(
        `/users/${localStorage.getItem("token")}`,
        requestBody
      );
      console.log(response);

      if (username) {
        myuser.username = username;
      }
      if (password) {
        myuser.password = password;
      }
      if (email) {
        myuser.email = email;
      }
      props.setCurrentUser(myuser);
      localStorage.setItem("user", JSON.stringify(myuser));
      alert("update successfully");

      history.push({
        pathname: `/profile/${localStorage.getItem("token")}`,
        state: { user: myuser },
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

  return (
    <BaseContainer className="edit container">
      <h2>Edit your Profile</h2>
      <div className="edit">
        <ul className="edit user-list">
          <FormField1
            label="Username"
            value={username}
            onChange={(username) => setUsername(username)}
            emailerror={emailError}
          />
          <FormField2
            label="Password"
            value={password}
            onChange={(password) => setPassword(password)}
            emailerror={emailError}
          />
          <div className="register field">
            <label className="register label">Email</label>

            <input
              type="text"
              className="register email"
              placeholder="Enter here.."
              autoComplete="off"
              // onKeyUp solves the problem of the onPaste and onInput events not working
              onKeyUp={(e) => validateEmail(e)}
              onChange={(e) => validateEmail(e)}
            ></input>
            <span
              style={{
                fontWeight: "bold",
                color: "red",
                fontSize: "10px",
                marginBottom: "15px",
              }}
            >
              {emailError}
            </span>
          </div>

          <Button
            width="100%"
            onClick={edit}
            disabled={
              emailError !== "Valid Email" &&
              (!username || (emailError !== "Valid Email" && email !== null)) &&
              (!password || (emailError !== "Valid Email" && email !== null))
            }
            //disabled={!username && !password && emailError !== "Valid Email" && email !== ''}
          >
            Edit Values
          </Button>
          {/*         <FormFieldDate
            label="Birthday"
            type="date"
            value={birthday}
            onChange={n => setBirthday(n)}
          />
        <Button
          width="100%"
          onClick={() => editBirthday()}
          disabled={!birthday}
        >
          Edit Birthday
        </Button> */}
        </ul>
        <Button width="100%" onClick={back}>
          Back
        </Button>
      </div>
    </BaseContainer>
  );
};

export default EditProfile;
