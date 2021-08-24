import logo from "../assets/game.png";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
const Header = ({ setHideModal, userToken, setToken, user }) => {
  const history = useHistory();
  return (
    <header>
      <div className="logoHeader">
        <img
          src={logo}
          alt="logo gamepad"
          onClick={() => {
            history.push("/");
          }}
        />
        <span>Gamepad</span>
      </div>
      {userToken && (
        <div>
          <Link to="/collection">
            {user.picture ? (
              <img
                src={user.picture}
                alt="profilePicture"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} />
            )}
            <span style={{ marginLeft: 10 }}>{user.username}</span>
          </Link>
        </div>
      )}
      {!userToken ? (
        <button
          onClick={() => {
            setHideModal(false);
          }}
          style={{ color: "white" }}
        >
          Login
        </button>
      ) : (
        <button style={{ color: "white" }} onClick={() => setToken(null)}>
          Disconnect
        </button>
      )}
    </header>
  );
};

export default Header;
