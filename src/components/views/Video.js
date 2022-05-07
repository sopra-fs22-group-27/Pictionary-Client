import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import '../../styles/views/VideoStyles.scss'
import beachVideo from 'resources/beach.mp4'

const Video = (props) => {
    const history = useHistory();
    // use Link to redirect
    // use onClick to redirect
    const redirect2register = () => {
      history.push("/register");
    };
    const redirect2login = () => {
      history.push("/login");
    };

    return (
        <div className='hero'>
            <video autoPlay loop muted id='video'>
                <source src={beachVideo} type='video/mp4' />
            </video>
            <div className='content'>
                <h1>Pictionary</h1>
                <p>An interactive drawing game</p>
                <div>
                    <Link onClick={redirect2login} className='btn btn-light'>Login</Link>
                    <Link onClick={redirect2register} className='btn btn-light'>Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Video