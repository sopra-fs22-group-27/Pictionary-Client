import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import '../../styles/views/VideoStyles.scss'
import mainVideo from 'resources/video1.mp4'
import firstgif from 'resources/first_gif.gif'
import secondgif from 'resources/second_gif.gif'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
                <source src={mainVideo} type='video/mp4' />
            </video>
            <div className='content'>
                <h1>Pictionary</h1>
                <p>An interactive drawing game</p>
                <div>
                    <Link onClick={redirect2login} className='btn btn-light'>Login</Link>
                    <Link onClick={redirect2register} className='btn btn-light'>Register</Link>
                </div>
            </div>

            <div className='hero2'>

            <div className='content'>

            <h1>How to play</h1>


            <Container>
            <Row>
                <Col><img src={firstgif} alt="loading..." /></Col>
                <Col>
                <h3>Guesser</h3>
                <text class="text-justify">
                As a guesser, you can see the drawing of the drawer. 
                Your goal should be to be as fast as possible in guessing the correct word for the drawing. 
                If you guess the drawing, you will receive 10 points. The player with the most points at the end of the game is the winner 
                of the game and gets 10 ranking points. If someone leaves the game, then the game will stop after the round and every player
                gets 2 ranking points. The leaver of the game will receive -100 ranking point.  
                Guess fast, time is your enemy.
                </text>
                </Col>
            </Row>
            </Container>
            <p></p> {/*sorry lol*/}
            <Container>
            <Row>
                <Col>
                <h3>Drawer</h3>
                <text class="text-justify">
                As a drawer, you have the possibility to draw the given word as good as you can. 
                You can choose between different colours, additional thickness of the pencil and more. 
                Your goal is to draw the word in a way such that the guessers are able to get some points. 
                Your drawing skills get graded by the Google Vision API and you can receive additional points for a perfect drawing. 
                </text>
                </Col>
                <Col><img src={secondgif} alt="loading..." /></Col>
                <p></p><p></p><p></p> {/*sorry lol*/}
            </Row>
            </Container>
            </div>
            </div>
        </div>
    )
}

export default Video