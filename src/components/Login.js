import { useState } from "react";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
const Login = ({ setHideModal }) => {
  const [signUpModal, setSignUpModal] = useState(false);
  const [signInModal, setSignInModal] = useState(false);
  return (
    <div className="displayModal">
      {!signUpModal && !signInModal && (
        <div className="chooseDiv">
          <div>
            <h3
              onClick={() => {
                setHideModal(true);
              }}
            >
              X
            </h3>
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
      {signInModal && <SignIn setSignInModal={setSignInModal} />}
      {signUpModal && <SignUp setSignUpModal={setSignUpModal} />}
    </div>
  );
};

export default Login;
