import Header from "components/views/Header";
import {ReactLogo} from "components/ui/ReactLogo";
import AppRouter from "components/routing/routers/AppRouter";
import 'bootstrap/dist/css/bootstrap.css'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import * as FiIcons from 'react-icons/fi';

const App = () => {
  return (
    <div>
<<<<<<< HEAD
      
=======
      <Navbar bg="dark" variant="dark"
        sticky="top" expand="lg" collapseOnSelect>
        <Navbar.Brand>
        <ReactLogo width="40px" height="40px"/>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
        <Nav>
          <Nav.Link href="Change me">Score Board</Nav.Link>
          <Nav.Link href="Change me">Play</Nav.Link>
          <Nav.Link href="Change me">Sign out</Nav.Link>
          <NavDropdown title={<FiIcons.FiSettings color="white"/>}>
            <NavDropdown.Item href="Change me">Edit Profile</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Edit whatever</NavDropdown.Item>
            <NavDropdown.Item href="Change me">Sign out </NavDropdown.Item>
          </NavDropdown>

        </Nav>
        </Navbar.Collapse>
      </Navbar>
>>>>>>> 1b55cd0296f0b863ccf8eba859f756f4b0a40fa8
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;


//<MdIcons.MdDashboard color="white" />