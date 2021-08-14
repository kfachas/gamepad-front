import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SignUp = ({ setSignUpModal }) => {
  const handleSubmit = () => {};
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
          <span>Email</span>
          <input type="mail" placeholder="email@liam.com" required />
        </div>
        <div>
          <span>Username</span>
          <input type="fname" placeholder="Emanresu" required />
        </div>
        <div>
          <span>Password</span>
          <input type="password" placeholder="drowssap" required />
        </div>
        <div>
          <span>Confirm password</span>
          <input type="password" placeholder="drowssap" required />
        </div>
        <input className="submitBtn" type="submit" />
      </form>
    </div>
  );
};

export default SignUp;
