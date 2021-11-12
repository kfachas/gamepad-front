import { useState } from "react";
import modalImg from "../assets/modalImg.jpg";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faBookmark,
  faCommentAlt,
} from "@fortawesome/free-regular-svg-icons";
import { connect } from "react-redux";
import { compose } from "redux";
const Login = ({ setHideModal, setToken, onSetUser }) => {
  const [signUpModal, setSignUpModal] = useState(false);
  const [signInModal, setSignInModal] = useState(false);

  return (
    <div className="displayModal">
      <div className="chooseDiv">
        <div style={{ backgroundColor: "black" }}>
          <img
            src={modalImg}
            alt=""
            style={{
              height: "500px",
              width: "250px",
              objectFit: "cover",
              opacity: "0.8",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }}
          />
          <h3 className="titleModal">Gamepad</h3>
        </div>
        <div className="choose">
          <div className="closeModal">
            <FontAwesomeIcon
              icon={faTimesCircle}
              onClick={() => {
                setHideModal(true);
              }}
            />
          </div>
          {!signUpModal && !signInModal && (
            <div>
              <p style={{ fontSize: 18 }}>How it works ?</p>
              <div className="how">
                <div>
                  <FontAwesomeIcon icon={faUser} />
                  <span style={{ paddingLeft: 10 }}>
                    Log in to your free account to be able to get all featurs of
                    Gamepad
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faBookmark} />
                  <span style={{ paddingLeft: 10 }}>
                    Add a game to your collection
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faCommentAlt} />
                  <span style={{ paddingLeft: 10 }}>
                    Leave a review for a game
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSignUpModal(true);
                }}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setSignInModal(true);
                }}
              >
                Sign In
              </button>
            </div>
          )}
          {signInModal && (
            <SignIn
              setSignInModal={setSignInModal}
              setToken={setToken}
              onSetUser={onSetUser}
              setHideModal={setHideModal}
            />
          )}{" "}
          {signUpModal && <SignUp setSignUpModal={setSignUpModal} />}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onSetUser: (user, uid) => dispatch({type: "USER_SET", user, uid})
})

export default compose(connect(null, mapDispatchToProps))(Login);
