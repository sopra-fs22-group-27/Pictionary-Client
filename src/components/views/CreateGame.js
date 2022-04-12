import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/views/CreateGame.scss';

const CreateGame = () => {  
    const history = useHistory();
    const [gameName, setGameName] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [roundLength, setRoundLength] = useState(60);
    const [numberOfRounds, setNumberOfRounds] = useState(10);
    const gameId = 'TEMP';

    return (
        <BaseContainer>
            <div className='form-container'>
                <div className='form-title'>CONFIGURE YOUR OWN GAME!</div>
                <div className='form-text'>
                    <div className='form-text-title'>Game name</div>
                    <input className='form-text-input' type='text' placeholder='Enter game name'
                        value={gameName}
                        style={{width: '70%'}}
                        onChange={(e) => {
                            setGameName(e.target.value);
                        }}
                    />
                </div>
                <div className='form-text'>
                    <div className='form-text-title'>Number of players</div>
                    <div className='form-text-input'>
                        <input className='form-text-input' type='text' placeholder='2'
                            value={numberOfPlayers}
                            onChange={(e) => {
                                setNumberOfPlayers(e.target.value);
                            }}
                        />
                        <button className='form-text-button'
                            onClick={() => {
                                if (numberOfPlayers > 1) {
                                    setNumberOfPlayers(numberOfPlayers - 1);
                                }
                            }}
                        >-</button>
                        <button className='form-text-button'
                            onClick={() => {
                                setNumberOfPlayers(numberOfPlayers + 1);
                            }}
                        >+</button>
                    </div>
                </div>
                <div className='form-text'>
                    <div className='form-text-title'>Round length</div>
                    <div className='form-text-input'>
                        <input className='form-text-input' type='text' placeholder='60'
                            value={roundLength}
                            onChange={(e) => {
                                setRoundLength(e.target.value);
                            }}
                        />
                        <button className='form-text-button'
                            onClick={() => {
                                if (roundLength > 5) {
                                    setRoundLength(roundLength - 5);
                                }
                            }}
                        >-</button>
                        <button className='form-text-button'
                            onClick={() => {
                                setRoundLength(roundLength + 5);
                            }}
                        >+</button>
                    </div>
                </div>
                <div className='form-text'>
                    <div className='form-text-title'>Number of rounds</div>
                    <div className='form-text-input'>
                        <input className='form-text-input' type='text' placeholder='10'
                            value={numberOfRounds}
                            onChange={(e) => {
                                setNumberOfRounds(e.target.value);
                            }}
                        />
                        <button className='form-text-button'
                            onClick={() => {
                                if (numberOfRounds > 1) {
                                    setNumberOfRounds(numberOfRounds - 1);
                                }
                            }}
                        >-</button>
                        <button className='form-text-button'
                            onClick={() => {
                                setNumberOfRounds(numberOfRounds + 1);
                            }}
                        >+</button>
                    </div>
                </div>
                <div className='form-button'>
                    <button className='form-button-start'
                        onClick={() => {
                            //create game via api here and redirect to lobby page
                            history.push('/lobby/' + gameId);
                        }}
                    >Start</button>
                </div>
            </div>
        </BaseContainer>
  );
};

export default CreateGame;
