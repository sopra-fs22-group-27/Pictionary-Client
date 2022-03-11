import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom'
/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField1 = props => {
  return (
    <div className="register field">
      <label className="register label">
        {props.label}
      </label>
      <input
        type="text"
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

const FormField2 = props => {
  return (
    <div className="register field">
      <label className="register label">
        {props.label}
      </label>
      <input
        type="password"
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField1.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

FormField2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Register = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
//  const [birthdate, setBirthdate] = useState(null);
  const myDate = new Date();
  const creation_date = myDate.toLocaleString()
  const doRegister = async () => {
    try {


      const requestBody = JSON.stringify({username, password, creation_date});
      const response = await api.post('/users', requestBody);
      console.log(response)
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      const number = localStorage.getItem('number');
      if(number != null){
        localStorage.setItem('number', number + 1);
      }else{
        localStorage.setItem('number', 1);
      }

      // Login successfully worked --> navigate to the route /profile in the GameRouter
//      history.push({pathname:`/profile/${user.id}`, state: {user: user, myuser: user}});
      history.push({pathname:`/userlist`, state:user});
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
//      history.push("/register");
//	  setPassword(null);
//	  setUsername(null);
	  window.location.reload();
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
        <div className="register center">Register</div>
          <FormField1
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField2
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />

          <div className="register button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
        <div className="register link">
            <div><Link to="/login">Login?</Link></div>
            <div><Link to="/home">Back To Home?</Link></div>
        </div>
      </div>

    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;
