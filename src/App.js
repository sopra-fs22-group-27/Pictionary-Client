import AppRouter from "components/routing/routers/AppRouter";
import { useEffect, useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {

  }, [currentUser]);
  useEffect(() => {
    window.addEventListener("storage", () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    });
  }, []);

  return (
    <div>
      <AppRouter currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  );
};

export default App;

