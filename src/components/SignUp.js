import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

const SignUp = ({ setSignUpModal }) => {
  const [values, setValues] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const handleChange = (e, type) => {
    const obj = { ...values };
    obj[type] = e.target.value;
    setValues(obj);
  };
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  const regexSpecialChar = /[^A-Za-z0-9_|\s]/g;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const searchSpecialChar = values.password.match(regexSpecialChar);
      const testEmail = values.email.match(regexEmail);
      if (!testEmail) {
        return setErrorMsg("Not a correct email");
      }
      if (
        values.password.charAt(0) !== values.password.charAt(0).toUpperCase()
      ) {
        return setErrorMsg(
          "The first character of your password must be a capital letter"
        );
      }
      if (!searchSpecialChar) {
        return setErrorMsg("Need one special character in ur password");
      }

      if (confirmPassword === values.password) {
        const formData = new FormData();
        formData.append("picture", file);
        formData.append("email", values.email);
        formData.append("username", values.username);
        formData.append("password", values.password);
        await axios.post("http://localhost:3310/user/signup", formData);
        alert("You can now sign in !");
      } else {
        setErrorMsg("Password not correct");
      }
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };
  return (
    <div className="signUpModal">
      <div className="goBack">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => setSignUpModal(false)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
        </div>
        <div>
          <span>Email</span>
          <input
            type="mail"
            onKeyDown={handleKeyDown}
            placeholder="email@liam.com"
            required
            onChange={(e) => handleChange(e, "email")}
          />
        </div>
        <div>
          <span>Username</span>
          <input
            type="fname"
            onKeyDown={handleKeyDown}
            placeholder="Emanresu"
            required
            minLength="4"
            onChange={(e) => handleChange(e, "username")}
          />
        </div>
        <div>
          <span>Password</span>
          <input
            type="password"
            onKeyDown={handleKeyDown}
            placeholder="drowssap"
            required
            minLength="6"
            onChange={(e) => handleChange(e, "password")}
          />
        </div>
        <div>
          <span>Confirm password</span>
          <input
            type="password"
            onKeyDown={handleKeyDown}
            placeholder="drowssap"
            required
            minLength="6"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <span style={{ fontSize: 13, textAlign: "center" }}>{errorMsg}</span>
        <input className="submitBtn" type="submit" />
      </form>
    </div>
  );
};

export default SignUp;
