import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import '../../styles/views/VideoStyles.scss'
import beachVideo from 'resources/beach.mp4'
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

            <div className='hero2'>

            <div className='content'>
            <p></p> {/*sorry lol*/}
            <h1>How to play Pictionary</h1>
            <p></p> {/*sorry lol*/}

            <Container>
            <Row>
                <Col>Picture</Col>
                <Col>
                <text class="text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lectus enim, vulputate lobortis magna ut, 
                eleifend tempor dui. Sed orci lorem, dapibus sed dapibus in, euismod vel lacus. Donec placerat tellus elit. 
                Sed sit amet varius orci, faucibus pellentesque lectus. Vestibulum at felis eu arcu tempus molestie a vel arcu. 
                Nullam tempus justo nunc, sed iaculis ante interdum sit amet. Nunc in euismod arcu. Mauris arcu lorem, imperdiet 
                efficitur magna
                </text>
                </Col>
            </Row>
            </Container>
            <p></p> {/*sorry lol*/}
            <Container>
            <Row>
                <Col>
                <text class="text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lectus enim, vulputate lobortis magna ut, 
                eleifend tempor dui. Sed orci lorem, dapibus sed dapibus in, euismod vel lacus. Donec placerat tellus elit. 
                Sed sit amet varius orci, faucibus pellentesque lectus. Vestibulum at felis eu arcu tempus molestie a vel arcu. 
                Nullam tempus justo nunc, sed iaculis ante interdum sit amet. Nunc in euismod arcu. Mauris arcu lorem, imperdiet 
                efficitur magna
                </text>
                </Col>
                <Col>Picture</Col>
            </Row>
            </Container>
            <Container>Maybe Team here</Container>
            </div>
            </div>
        </div>
    )
}

export default Video