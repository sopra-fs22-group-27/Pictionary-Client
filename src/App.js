import AppRouter from "components/routing/routers/AppRouter";
import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {

  }, [currentUser]);
  useEffect(() => {
    window.addEventListener("storage", () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    });
  }, []);

  const logout = async () => {
    
      try {
        await api.put(`/status/${localStorage.getItem("token")}`);
        localStorage.clear();
        window.location.reload();
      } catch (error) {
        alert(
          `Something went wrong during updating the logged_out status: \n${handleError(
            error
          )}`
        );
      }
  };

  return (
    <div>
      <AppRouter currentUser={currentUser} setCurrentUser={setCurrentUser} logout={logout}/>
    </div>
  );
};

export default App;

