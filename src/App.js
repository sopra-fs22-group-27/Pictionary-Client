import Header from "components/views/Header";
import { ReactLogo } from "components/ui/ReactLogo";
import AppRouter from "components/routing/routers/AppRouter";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import * as FiIcons from "react-icons/fi";
import User from "models/User";
import { useEffect, useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  useEffect(() => {
    window.addEventListener("storage", () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    });
  }, []);

  return (
    <div>
      {/* <Header currentUser={currentUser} height="100"/>  */}
      <AppRouter currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  );
};

export default App;

//<MdIcons.MdDashboard color="white" />
