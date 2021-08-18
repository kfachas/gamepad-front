import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
const SignIn = ({ setSignInModal, setToken, setHideModal }) => {
  const [values, setValues] = useState({});
  const handleChange = (e, type) => {
    const obj = { ...values };
    obj[type] = e.target.value;
    setValues(obj);
  };
  console.log(values);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (values.password && values.email) {
        const response = await axios.post(
          "https://gamepad-back.herokuapp.com/user/login",
          values
        );
        setToken(response.data.token, response.data);
        setHideModal(true);
      }
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };
  return (
    <div className="signInModal">
      <div className="goBack">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => setSignInModal(false)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          required
          onChange={(e) => handleChange(e, "email")}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => handleChange(e, "password")}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default SignIn;
