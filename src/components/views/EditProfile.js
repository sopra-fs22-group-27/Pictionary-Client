import {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import { useLocation } from "react-router-dom";
import "styles/views/EditProfile.scss";

const FormField = props => {
    return (
      <div className="edit field">
        <label className="edit label">
          {props.label}
        </label>
        <input
          className="edit input"
          placeholder="enter here.."
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

  const back = () => {
    history.push({pathname:`/profile/${myuser.id}`, state: {user: myuser, myuser: myuser}});
  }

  const editUsername = async () => {
    try {
        const requestBody = JSON.stringify({ username });
        const response = await api.put(`/users/${myuser.id}`, requestBody);
        console.log(response);
        //      const user = new User(response.data);
        alert("update successfully");
        // myuser.birthday = birthday;
  
        myuser.username = username;
  
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
        <FormField
            label="Username"
            value={username}
            onChange={username => setUsername(username)}
          />
        <Button
          width="100%"
          onClick={() => editUsername()}
          disabled={!username}
        >
          Edit Username
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