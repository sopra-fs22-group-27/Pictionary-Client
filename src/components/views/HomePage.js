import React from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/views/HomePage.scss';
import { useEffect } from 'react';
import Lobby from 'models/Lobby';
import {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import PropTypes from "prop-types";

const LobbyView = ({lobby}) => (
  <div className="lobby container">
    <div className="lobby name">{lobby.lobbyname}</div>
    <div className="public or private">{lobby.ispublic}</div>
    <div className="In game">id: {lobby.isingame}</div>
    <div className="host">id: {lobby.host}</div>
    <div className="gamelength">id: {lobby.gamelength}</div>
  </div>
);

LobbyView.propTypes = {
  lobby: PropTypes.object
};


const HomePage = () => {  
  const history = useHistory();
  const [lobbies, setLobbies] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/lobby');

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setLobbies(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let content = <Spinner/>;

  if (lobbies) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {lobbies.map(lobby => (
            <LobbyView lobby={lobby} key={lobby.token}/>
          ))}
        </ul>
      </div>
    );
  }


  return (
    <BaseContainer>
    <div className='create-game-container'>
        <div className='create-game-banner'>
            <div className='create-game-text-container'>
                <div className='create-game-title'>CONFIGURE YOUR OWN GAME!</div>
                <div className='create-game-text'> Want to be the game master? Customize and host your own game!</div>
            </div>
          <div
            className='create-game-button'
            onClick={() => {            
                history.push('/create-game');
            }}
          >
            Start Now
          </div>
        </div>
    </div>
    {content}
    </BaseContainer>
  );
};

export default HomePage;
