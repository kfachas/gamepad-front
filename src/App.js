import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Collection from "./containers/Collection";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import Game from "./containers/Game";

import Grid from '@mui/material/Grid';
import { connect } from "react-redux";
import { compose } from "redux";

function App({currentUser, onSetUser}) {
  
  const [hideModal, setHideModal] = useState(true);



  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("session", JSON.stringify(currentUser))
    } else {
      const data = JSON.parse(localStorage.getItem("session"))
      onSetUser(data, data.uid)
    }
  }, [currentUser])


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
        <Login
        setHideModal={setHideModal}
          hideModal={hideModal}
        />
      )}
      <Switch>
        <Route exact path="/collection" component={Collection} />
   
        <Route exact path="/games/:id" component={Game} />
        <Route exact path="/" component={Home} />
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
    currentUser: state.userState.currentUser
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSetUser: (user, uid) => dispatch({type: "USER_SET", user, uid})
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
