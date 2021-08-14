import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./containers/Home";
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Collection from "./containers/Collection";
import Login from "./components/Login";
import { useState } from "react";

function App() {
  const [hideModal, setHideModal] = useState(true);
  return (
    <Router>
      <Header setHideModal={setHideModal} />
      {!hideModal && (
        <Login hideModal={hideModal} setHideModal={setHideModal} />
      )}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="collection">
          <Collection />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
