//#region
import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom'
import validator from 'validator'

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
        placeholder="Enter here.."
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
        placeholder="Enter here.."
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
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
//#endregion
/*   const validateEmail = (e) => {
    //console.log(email);
    setEmail(e.target.value);
    if(validator.isEmail(email)){
      setEmailError('Valid Email');
    } else if(!validator.isEmail(email) && email !== ''){
      setEmailError('Invalid Email');
    } else if (!validator.isEmail(email) && email === ''){
      setEmailError('');
    }
    
  } */

  const emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const validateEmail = (e) => {
    setEmail(e.target.value);
    if(email.match(emailValidator)){
      setEmailError('Valid Email');
    } else {
      setEmailError('Invalid Email');
    }
  }

//#region
  useEffect(() => {
    //console.log("Email message inside useEffect: ", email);
    //console.log("Email message inside useEffect: ", emailError);
  }, [email, emailError]);
//  const [birthdate, setBirthdate] = useState(null);
  const myDate = new Date();
  const creation_date = myDate.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });

// registration function
  const doRegister = async () => {
    try {

      const requestBody = JSON.stringify({username, password, creation_date, email});
      const response = await api.post('/users', requestBody);
      //console.log(response)
      // Get the returned user and update a new object.
      const user = new User(response.data);
      props.setCurrentUser(user);
      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem("user", JSON.stringify(user));
      // Login successfully worked --> navigate to the route /profile in the GameRouter
//      history.push({pathname:`/profile/${user.id}`, state: {user: user, myuser: user}});
      history.push({pathname:`/homepage`});
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
//      history.push("/register");
//	  setPassword(null);
//	  setUsername(null);
	  window.location.reload();
    }
  };
//#endregion     
  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
        <div className="register center">Sign up</div>
          <FormField1
            label="Username"
            value={username}
            onChange={un => {setUsername(un)}}
            emailerror={emailError}
          />
          <div className="register field">
            <label className="register label">
              Email
            </label>
     
       <input type="text"
        className="register email"
        placeholder="Enter here.."
        autoComplete="off"

        //onPaste={(e) => validateEmail(e)}
        //onInput={(e) => validateEmail(e)}

        // onKeyUp solves the problem of the onPaste and onInput events not working
        onKeyUp={(e) => validateEmail(e)}
        onChange={(e) => validateEmail(e)}
        >

        </input>
        <span style={{
          fontWeight: 'bold',
          color: 'red',
          fontSize: "10px",
          marginBottom: "15px"
        }}>{emailError}</span>
  
    
      
          </div>
        
          <FormField2
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />

          <div className="register button-container">
            <Button
              disabled={!username || !password || emailError !== "Valid Email"}
              width="80px"
              height="34px"
              onClick={() => doRegister()}
            >
              Sign up!
            </Button>
            {/* <Button
            
              width="80px"
              height="34px"
              onClick={() => alert(new Date((new Date().setHours(new Date().getHours() - (new Date().getTimezoneOffset() / 60)))).toISOString())}
            >
              Sign up!
            </Button> */}
            
          </div>
        </div>
        <div className="register link">
            <div><Link to="/login">Login?</Link></div>
            <div><Link to="/startingpage">Back To Starting Page?</Link></div>
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
