import React, {useState} from 'react';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/views/Lobby.scss';

const CreateGame = () => {  
    const totalPlayers = 4; //TEMP VALUE
    const currentPlayers = 2; //TEMP VALUE

    //get how many users have joined this game in 5 second intervals and display it

    return (
        <BaseContainer>
            <div className='lobby-container'>
                <div className='lobby-text'>Waiting for players</div>
                <div className='lobby-numbers'>{currentPlayers}/{totalPlayers}</div>
            </div>
        </BaseContainer>
  );
};

export default CreateGame;
