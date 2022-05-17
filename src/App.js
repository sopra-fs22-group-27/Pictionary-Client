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

  useEffect(() => {
    const unloadCallback = async (event) => {
      event.preventDefault();
      try {
        await api.put(`/status/${localStorage.getItem("token")}`);
        window.localStorage.clear();
      } catch (error) {
        alert(
          `Something went wrong during updating the logged_out status: \n${handleError(
            error
          )}`
        );
      }
      
    };

    window.addEventListener("unload", unloadCallback);
    return () => window.removeEventListener("unload", unloadCallback);
  }, []);

  return (
    <div>
      <AppRouter currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </div>
  );
};

export default App;

