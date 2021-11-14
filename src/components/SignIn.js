import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
const SignIn = ({ setSignInModal, setHideModal, onSetUser }) => {
  const [values, setValues] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const handleChange = (e, type) => {
    const obj = { ...values };
    obj[type] = e.target.value;
    setValues(obj);
  };

  const handleSubmit = async (e) => {
    setErrorMsg("");
    e.preventDefault();
    try {
      if (values.password && values.email) {
        const response = await axios.post(
          "http://localhost:3310/user/login",
          values
        );
        onSetUser(response.data, response.data._id);
        setHideModal(true);
      }
    } catch (error) {
      console.log(error.message);
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
        {errorMsg}
        <input type="submit" />
      </form>
    </div>
  );
};

export default SignIn;
