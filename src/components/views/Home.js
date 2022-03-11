import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Home.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
const Home = props => {
  const history = useHistory();
// use Link to redirect
// use onClick to redirect
  const redirect2register = props =>{
    history.push('/register')
  }
  const redirect2login = () =>{
    history.push('/login')
  }
  var myDate = new Date();
//        {myDate.toLocaleString()} 下午 to afternoon?
  return (
    <BaseContainer>
      <div className="home container">
      <div className="home form">
          <div className="home center">Home</div>
          <div className="home button-container">

            <Button width="100%" onClick={redirect2register}>
              Register
            </Button>

          </div>
          <div className="home button-container">
          <Button width="100%" onClick={redirect2login}>

          Login
          </Button>
          </div>
      </div>
      </div>
    </BaseContainer>
  );
};


export default Home;