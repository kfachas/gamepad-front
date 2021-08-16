import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

const SignUp = ({ setSignUpModal }) => {
  const [values, setValues] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState();
  const handleChange = (e, type) => {
    const obj = { ...values };
    obj[type] = e.target.value;
    setValues(obj);
  };
  console.log(values);
  console.log(confirmPassword);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword === values.password) {
        const formData = new FormData();
        formData.append("picture", file);
        formData.append("email", values.email);
        formData.append("username", values.username);
        formData.append("password", values.password);
        const response = await axios.post(
          "http://localhost:3001/user/signup",
          formData
        );
        console.log(response.data);
      } else {
        alert("Password not similair");
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
            placeholder="email@liam.com"
            required
            onChange={(e) => handleChange(e, "email")}
          />
        </div>
        <div>
          <span>Username</span>
          <input
            type="fname"
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
            placeholder="drowssap"
            required
            minLength="6"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <input className="submitBtn" type="submit" />
      </form>
    </div>
  );
};

export default SignUp;
