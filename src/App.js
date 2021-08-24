import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Collection from "./containers/Collection";
import Login from "./components/Login";
import { useState } from "react";
import Game from "./components/Game";
import Cookies from "js-cookie";
function App() {
  const [hideModal, setHideModal] = useState(true);
  const [userToken, setUserToken] = useState();
  const [user, setUser] = useState({});
  const setToken = (token, userInfo) => {
    if (token) {
      Cookies.set("token", token);
      setUserToken(token);
    } else {
      Cookies.remove("token");
      setUserToken(null);
    }
    if (userInfo) {
      const obj = { ...user };
      obj.picture = userInfo.account.avatar;
      obj.username = userInfo.account.username;
      setUser(obj);
    } else {
      setUser(null);
    }
  };
  return (
    <Router>
      <Header
        setHideModal={setHideModal}
        userToken={userToken}
        setToken={setToken}
        user={user}
      />
      {!hideModal && (
        <Login
          hideModal={hideModal}
          setHideModal={setHideModal}
          setToken={setToken}
        />
      )}
      <Switch>
        <Route exact path="/collection">
          <Collection userToken={userToken} />
        </Route>
        <Route exact path="/games/:id">
          <Game userToken={userToken} />
        </Route>
        <Route exact path="/">
          <Home userToken={userToken} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
