import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const SignIn = ({ setSignInModal }) => {
  const handleSubmit = () => {};
  return (
    <div className="signInModal">
      <div className="goBack">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => setSignInModal(false)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <input type="submit" />
      </form>
    </div>
  );
};

export default SignIn;
