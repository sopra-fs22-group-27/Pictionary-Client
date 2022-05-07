import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Startingpage.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Video from "./Video";

const Startingpage = (props) => {
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
    <div>
    <Video />
    </div>
  );
};

export default Startingpage;
