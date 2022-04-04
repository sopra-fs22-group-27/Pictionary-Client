import {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import { useLocation } from "react-router-dom";
import validator from 'validator'
import "styles/views/EditProfile.scss";

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

/*   const FormFieldDate = props => {
    return (
      <div className="edit field">
        <label className="edit label">
          {props.label}
        </label>
        <input
          className="edit input"
          placeholder="yyyy-mm-dd"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    );
  }; */

const EditProfile = () => {
    const history = useHistory();

    const location = useLocation();
    var myuser = location.state;

    //const [birthday, setBirthday] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');

    const validateEmail = (e) => {
        //console.log(email);
        setEmail(e.target.value);
        if(validator.isEmail(email)){
          setEmailError('Valid Email');
        } else if(!validator.isEmail(email) && email !== ''){
          setEmailError('Invalid Email');
        } else if (!validator.isEmail(email) && email === ''){
          setEmailError('');
        }
        
      }

  const back = () => {
    history.push({pathname:`/profile/${myuser.id}`, state: {user: myuser, myuser: myuser}});
  }

  const edit = async () => {
    try {
        const requestBody = JSON.stringify({ username, password, email });
        const response = await api.put(`/users/${myuser.id}`, requestBody);
        console.log(response);
        //      const user = new User(response.data);
        alert("update successfully");
        // myuser.birthday = birthday;
  
        if (username){
            myuser.username = username;
        }
        if (password){
            myuser.password = password;
        }
        if (email){
            myuser.email = email;
        }

  
        history.push({pathname:`/profile/${myuser.id}`, state: {user: myuser, myuser: myuser}});
      } catch (error) {
        alert(
          `Something went wrong during updating the profile: \n${handleError(
            error
          )}`
        );
        window.location.reload();
      }

  }

/*   const editBirthday = async () => {
    try{
      const requestBody = JSON.stringify({birthday});
      const response = await api.put('/editBirthday/'+localStorage.getItem("profileId"), requestBody);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);
      console.log(response);
      history.push('/profile/'+localStorage.getItem("profileId"))
  }catch(error) {
      console.error(`Something went wrong while changing the birthday: \n${handleError(error)}`);
      console.error("Details:", error);
      alert("Something went wrong while changing the birthday! See the console for details.");
  }
  } */

  return (
    <BaseContainer className="edit container">
      <h2>Edit your Profile</h2>
      <div className="edit">
        <ul className="edit user-list">
        <FormField1
            label="Username"
            value={username}
            onChange={username => setUsername(username)}
            emailerror={emailError}
          />
        <FormField2
            label="Password"
            value={password}
            onChange={password => setPassword(password)}
            emailerror={emailError}
          />
          <div className="register field">
            <label className="register label">
              Email
            </label>
     
       <input type="text"
        className="register email"
        placeholder="Enter here.."
        // value={props.value}
        onChange={(e) => validateEmail(e)}></input>
        <span style={{
          fontWeight: 'bold',
          color: 'red',
          fontSize: "10px",
          marginBottom: "15px"
        }}>{emailError}</span>
        </div>

        <Button
          width="100%"
          onClick={() => edit()}
          disabled={emailError !== "Valid Email" && (!username || (emailError !== "Valid Email" && email !== '')) && (!password || (emailError !== "Valid Email" && email !== ''))}
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
        <Button
          width="100%"
          onClick={() => back()}
        >
          Back
        </Button>
      </div>
    </BaseContainer>
  );
}

export default EditProfile;