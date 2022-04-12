import React from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/views/HomePage.scss';

const HomePage = () => {  
    const history = useHistory();

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
    {/* ADD JOIN GAME HERE */}
    </BaseContainer>
  );
};

export default HomePage;
