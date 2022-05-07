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

            <div className='hero2'>

            <div className='content'>
                <h1>How to play Pictionary</h1>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lectus enim, vulputate lobortis magna ut, 
                eleifend tempor dui. Sed orci lorem, dapibus sed dapibus in, euismod vel lacus. Donec placerat tellus elit. 
                Sed sit amet varius orci, faucibus pellentesque lectus. Vestibulum at felis eu arcu tempus molestie a vel arcu. 
                Nullam tempus justo nunc, sed iaculis ante interdum sit amet. Nunc in euismod arcu. Mauris arcu lorem, imperdiet 
                efficitur magna in, efficitur sollicitudin leo. Proin dignissim, nunc ut fermentum aliquam, nisi lorem volutpat 
                ligula, at lobortis ipsum leo quis magna. Maecenas enim dolor, accumsan at felis elementum, rutrum varius ex. 
                Aliquam erat volutpat. In ut lectus eu nisl blandit mattis sit amet vel lectus. Morbi quis felis sit amet massa 
                tristique lobortis quis ac est. Pellentesque sodales fringilla erat sed sodales. Aenean in pharetra velit. 
                Integer elementum, est ut lobortis finibus, quam risus vehicula urna, eget ultrices purus ante vel urna. 
                Integer malesuada egestas sapien sed finibus. Mauris scelerisque urna efficitur, interdum felis ac, aliquet erat. 
                Fusce nec odio auctor, vehicula nunc ac, consectetur urna. In dictum justo non facilisis pellentesque. 
                Nullam molestie porttitor pellentesque. Ut tristique odio in dolor commodo mattis. Duis consequat ornare purus, 
                id auctor augue rutrum sodales. Aliquam ultricies, elit et cursus auctor, neque ex tincidunt lacus, eu lacinia 
                enim ante eget ligula. Nunc maximus lacinia purus ut molestie. Donec pulvinar convallis augue. Quisque vel neque 
                eu nunc molestie sollicitudin et at orci. In a finibus ligula, quis efficitur odio. Etiam non ligula dolor. 
                Curabitur at malesuada nibh, non ultricies est. Praesent euismod ligula sed lectus aliquam, a dignissim lorem tempor. 
                Quisque semper cursus ante sed fringilla.
                </p>
            </div>
            </div>
        </div>
    )
}

export default Video