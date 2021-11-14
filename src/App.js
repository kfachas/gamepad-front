import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./containers/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Collection from "./containers/Collection";
import Login from "./components/Login";
import { useEffect, useRef, useState } from "react";
import Game from "./containers/Game";

import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import { compose } from "redux";
import NoMatch from "./containers/NoMatch";

import { io } from "socket.io-client";

function App({ currentUser, onSetUser }) {
  const [hideModal, setHideModal] = useState(true);
  const socket = useRef();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("session", JSON.stringify(currentUser));
      localStorage.setItem("lastDay", new Date());
    } else if (localStorage.getItem("session")) {
      const data = JSON.parse(localStorage.getItem("session"));
      onSetUser(data, data.uid);
    }
  }, [currentUser]);

  const routeWhoNeedAuth = [
    {
      pathname: "/collection",
      component: Collection,
    },
  ];

  useEffect(() => {
    socket.current = io("localhost:8900");
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.on("welcome", (message) => console.log(message));
    socket.current.emit("addUser", currentUser?.uid);
    socket.current.on("getUsers", (message) =>
      console.log("getUsers", message)
    );
  }, [currentUser?.uid]);

  return (
    <Router>
      <Grid container>
        <Grid item xs={12}>
          <Header
            setHideModal={setHideModal}
            isConnected={localStorage.getItem("session")}
            currentUser={currentUser}
          />
        </Grid>
        {!hideModal && (
          <Login setHideModal={setHideModal} hideModal={hideModal} />
        )}
        <Switch>
          <Route exact path={["/", "/games"]} component={Home} />
          <Route exact path="/games/:id" component={Game} />
          {currentUser ? (
            routeWhoNeedAuth.map(({ pathname, component }, index) => (
              <Route key={index} exact path={pathname} component={component} />
            ))
          ) : (
            <Redirect to="/" />
          )}

          <Route path="*" component={NoMatch} />
        </Switch>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.userState.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSetUser: (user, uid) => dispatch({ type: "USER_SET", user, uid }),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
